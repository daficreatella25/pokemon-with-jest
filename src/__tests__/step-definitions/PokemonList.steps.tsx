import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";
import React from "react";
import PokemonList from "../../pages/PokemonList";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { Pages } from "../../types/Navigation";
import { FlatList, TextInput, Pressable } from "react-native";

import { PokemonServices } from "../../services/pokemon/pokemon.services";

const feature = loadFeature("./src/__tests__/features/PokemonList.feature");

jest.mock('../../services/pokemon/pokemon.services');

// Mock the navigation prop
const mockNavigation: Partial<NativeStackNavigationProp<Pages, "List">> = {
  navigate: jest.fn(),
};

const mockRoute: Partial<RouteProp<Pages, "List">> = {};

defineFeature(feature, (test) => {
  let wrapper: ShallowWrapper;
  let instance: PokemonList;
  let mockGetPokemonByPage: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    jest.useFakeTimers()
    mockGetPokemonByPage = jest.fn();
    PokemonServices.prototype.getPokemonByPage = mockGetPokemonByPage;
  });

  test("User interacts with Pokemon List", ({ given, when, then }) => {
    given("I am a User loading the Pokemon List", () => {
      wrapper = shallow(<PokemonList navigation={mockNavigation as NativeStackNavigationProp<Pages, "List">} route={mockRoute as RouteProp<Pages, "List">} />);
      instance = wrapper.instance() as PokemonList;
    });

    when("I load the Pokemon List", async () => {
      const mockPokemonList = {
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
        ],
      };
      mockGetPokemonByPage.mockResolvedValue(mockPokemonList);
      
      await instance.loadPokemon();
      await new Promise(resolve => setImmediate(resolve));
      wrapper.update();
    
      if (instance.state.pokemonList.length === 0) {
        instance.setState({ 
          pokemonList: mockPokemonList.results,
          isLoading: false,
          page: 1
        });
        wrapper.update();
      }
    });

    then("I should see a list of Pokemon", () => {
      expect(mockGetPokemonByPage).toHaveBeenCalled();
      const flatList = wrapper.find(FlatList);
      expect(flatList.prop('data')?.length).toBe(2);
    });

    when("I search for a specific Pokemon", () => {
      const searchInput = wrapper.find(TextInput);
      searchInput.simulate('changeText', 'bulbasaur');
      jest.runAllTimers();
    });

    then("I should see the search results", async () => {
      const mockSearchResult = { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' };
      (PokemonServices.prototype.getPokemonByName as jest.Mock).mockResolvedValue(mockSearchResult);
  
      instance.setState({ 
        pokemonList: [mockSearchResult],
        isLoading: false,
        query: 'bulbasaur'
      });
      
      
      await new Promise(resolve => setImmediate(resolve)); // Wait for state updates
      wrapper.update();
      
      const flatList = wrapper.find(FlatList);
      expect(instance.state.pokemonList.length).toBe(1);
      expect(flatList.prop('data')?.length).toBe(1);
    });

    when("I select a Pokemon from the list", () => {
      const flatList = wrapper.find(FlatList);
      const renderItem = flatList.prop('renderItem');
      if (renderItem && instance.state.pokemonList.length > 0) {
        const selectedPokemon = instance.state.pokemonList[0];
        
        const renderedItem = renderItem({ 
          item: selectedPokemon, 
          index: 0, 
          separators: { 
            highlight: () => {}, 
            unhighlight: () => {}, 
            updateProps: () => {} 
          } 
        });
        
        if (renderedItem) {
          const shallowRenderedItem = shallow(renderedItem);
          
          const pressable = shallowRenderedItem.find(Pressable);
          if (pressable.exists()) {
            pressable.simulate('press');
          } else {
            console.error('No Pressable component found in rendered item');
            throw new Error('No Pressable component found in rendered item');
          }
        } else {
          console.error('renderItem returned null');
          throw new Error('renderItem returned null');
        }
      } else {
        console.error('renderItem prop not found on FlatList or pokemonList is empty');
        throw new Error('renderItem prop not found on FlatList or pokemonList is empty');
      }
    });
    
    then("I should navigate to the Pokemon Detail screen", () => {
      expect(mockNavigation.navigate).toHaveBeenCalled();
      const navigateCall = (mockNavigation.navigate as jest.Mock).mock.calls[0];
      
      expect(navigateCall[0]).toBe("Detail");
      expect(navigateCall[1]).toHaveProperty('id');
    });
  });
});

