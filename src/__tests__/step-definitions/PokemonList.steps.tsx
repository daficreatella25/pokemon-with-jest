import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";
import React from "react";
import PokemonList, { Props } from "../../pages/PokemonList";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { Pages } from "../../types/Navigation";
import { FlatList, TextInput } from "react-native";
import { PokemonServices } from "../../services/pokemon/pokemon.services";
import { NameUrl } from "../../types/Pokemon";

const feature = loadFeature("./src/__tests__/features/PokemonList.feature");

jest.mock('../../services/pokemon/pokemon.services');

const mockNavigation: Partial<NativeStackNavigationProp<Pages, "List">> = {
  navigate: jest.fn(),
};

const mockRoute: Partial<RouteProp<Pages, "List">> = {};

defineFeature(feature, (test) => {
  let wrapper: ShallowWrapper
  let instance: PokemonList
  let props: Props


  beforeEach(() => {
    jest.useFakeTimers();
    jest.resetAllMocks();
    jest.resetModules();

    const mockPokemonServices = {
      getPokemonByPage: jest.fn().mockResolvedValue({
        results: [
          { name: 'Bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { name: 'Charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
        ],
      }),
      getPokemonByName: jest.fn().mockResolvedValue(
        {
          results: { name: 'Pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' }
        }
      ),
    };

    (PokemonServices as jest.Mock).mockImplementation(() => mockPokemonServices);

    props = {
      navigation: { navigate: jest.fn() },
    } as unknown as Props;

    
  });

  test("User interacts with Pokemon List", ({ given, when, then }) => {
    given("I am a User loading the Pokemon List", () => {
      wrapper = shallow(<PokemonList {...props}/>);
      instance = wrapper.instance() as PokemonList;
      instance.componentDidMount();
    });

    when("I load the Pokemon List", async () => {
      instance = wrapper.instance() as PokemonList;
      const mockPokemonList = [
        { name: 'Bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'Charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
      ];

      (instance.getPokemonServices().getPokemonByPage as jest.Mock).mockResolvedValue(mockPokemonList);
    
      await instance.loadPokemon();
    
      jest.runAllTimers();
      
      wrapper.update();
    });

    then("I should see a list of Pokemon", () => {
      expect(instance.state.pokemonList.length).toBe(2);
      expect(instance.state.pokemonList[0].name).toBe('Bulbasaur');
      expect(instance.state.pokemonList[1].name).toBe('Charmander');
    });

    when("I search for a specific Pokemon", async () => {
      const searchInput = wrapper.find({ testID: 'pokemon-search-input' });
      searchInput.props().onChangeText('pikachu');
      await instance.handleQueryChange('pikachu');

      const mockPokemonList = 
      {
        name: 'Pikachu', url: 'https://pokeapi.co/api/v2/pokemon/1/' 
      };
        
      jest.advanceTimersByTime(300);
      

      (instance.getPokemonServices().getPokemonByName as jest.Mock).mockResolvedValue(mockPokemonList);
    
      await instance.loadPokemon();
      
      jest.runAllTimers();
      wrapper.update();
    });
    
    then("I should see the search results", () => {
      expect(instance.state.pokemonList.length).toBe(1);
      expect(instance.state.pokemonList[0].name).toBe('Pikachu');
    });

    when("I select a Pokemon from the list", () => {
      const flatList = wrapper.find({ testID: "pokemon-list" });

      const renderItem = flatList.prop('renderItem');

      const mockItem: NameUrl = { name: 'Pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' };
      const renderedItem = renderItem({ 
        item: mockItem, 
        index: 0,
      });

      const pokemonCard = shallow(renderedItem);

      const pressable = pokemonCard.find('Pressable');
      pressable.simulate('press');

    });

    then("I should navigate to the Pokemon Detail screen", () => {
      expect(props.navigation.navigate).toHaveBeenCalledWith('Detail', {
        id: expect.any(Number),
      });
    });
  });
});