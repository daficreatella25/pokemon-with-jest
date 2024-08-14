import { shallow, ShallowWrapper } from "enzyme"
import { defineFeature, loadFeature } from "jest-cucumber"
import PokemonList from "../../pages/PokemonList"
import { NameUrl } from "../../types/Pokemon"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Pages } from "../../types/Navigation"
import { FlatList } from "react-native"

jest.mock('apisauce', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

jest.mock('../../services/pokemon/pokemon.services', () => {
  return {
    PokemonServices: jest.fn().mockImplementation(() => ({
      getPokemonByPage: jest.fn().mockResolvedValue({
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
        ],
      }),
      getPokemonByName: jest.fn().mockResolvedValue({
        name: 'bulbasaur',
        url: 'https://pokeapi.co/api/v2/pokemon/1/',
      }),
    })),
  };
});

const feature = loadFeature("./src/__tests__/features/PokemonList.feature")

defineFeature(feature, (test) => {
  let props: NativeStackScreenProps<Pages, "List">
  let wrapper: ShallowWrapper
  let instance: PokemonList

  beforeEach(() => {
    jest.resetModules()
    props = {
      navigation: {
        dispatch: jest.fn(),
      } as any,
      route: {} as any,
    }
    wrapper = shallow(<PokemonList {...props} />)
    instance = wrapper.instance() as PokemonList
  })

  test("Render Pokemon List", ({ given, when, then }) => {
    given("I am on the Pokemon List screen", () => {
      // No need to do anything here since beforeEach already handles it
    })

    when("I successfully load Pokemon List screen", async () => {
      await instance.componentDidMount()
      await new Promise(resolve => setTimeout(resolve, 0)) // Wait for state updates
      wrapper.update()
    })

    then("I should see a list of Pokemon", () => {
      const flatList = wrapper.find(FlatList)
      expect(flatList.exists()).toBe(true)
      const flatListProps = flatList.props()
      expect(flatListProps.data?.length).toBeGreaterThan(0)
    })

    when("I scroll down to end", async () => {
      // Simulate loading more Pokemon
      await instance.loadPokemon()
      await new Promise(resolve => setTimeout(resolve, 0)) // Wait for state updates
      wrapper.update()
    })

    then("I should see more Pokemon", () => {
      const flatList = wrapper.find(FlatList)
      expect(flatList.exists()).toBe(true)
      const flatListProps = flatList.props()
      expect(flatListProps.data?.length).toBeGreaterThan(0)
    })
  })
})