import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";
import React from "react";
import PokemonDetail from "../../pages/PokemonDetail";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pages } from "../../types/Navigation";
import { PokemonServices } from "../../services/pokemon/pokemon.services";
import { PokemonDetailObj } from "../../types/PokemonAbilites";

const feature = loadFeature("./src/__tests__/features/PokemonDetail.feature");

jest.mock('../../services/pokemon/pokemon.services');

defineFeature(feature, (test) => {
  let props: NativeStackScreenProps<Pages, "Detail">;
  let wrapper: ShallowWrapper;
  let instance: PokemonDetail;

  beforeEach(() => {
    jest.resetModules();
    props = {
      navigation: {} as any,
      route: { params: { id: 1 } } as any,
    };
    wrapper = shallow(<PokemonDetail {...props} />);
    instance = wrapper.instance() as PokemonDetail;
  });

  test("User views Pokemon Detail", ({ given, when, then }) => {
    given("I am a User loading the Pokemon Detail", () => {
      // The component is already initialized in beforeEach
    });

    when("I load the Pokemon Detail screen", async () => {
      const mockPokemonDetail: PokemonDetailObj = {
        id: 1,
        name: 'bulbasaur',
        sprites: {
          front_default: 'https://example.com/bulbasaur.png',
          back_default: "",
          front_shiny: "",
          back_shiny: ""
        },
        types: [{
          type: {
            name: 'grass',
            url: 'https://example.com/bulbasaur.png'
          },
          slot: 0
        }],
        stats: [{
          base_stat: 45, stat: {
            name: 'hp',
            url: ""
          },
          effort: 0
        }],
        abilities: [{
          ability: {
            name: 'overgrow',
            url: ""
          },
          is_hidden: false,
          slot: 0
        }],
        height: 0,
        weight: 0,
        base_experience: 0,
        species: {
          name: "",
          url: ""
        }
      };
      (PokemonServices.prototype.getPokemonById as jest.Mock).mockResolvedValue(mockPokemonDetail);
      await instance.componentDidMount();
      wrapper.update();
    });

    then("I should see the Pokemon's details", () => {
      expect(wrapper.find('Image').prop('source')).toEqual({ uri: 'https://example.com/bulbasaur.png' });
      expect(wrapper.find('Text').findWhere(n => n.text() === 'bulbasaur').exists()).toBeTruthy();
    });
  });
});