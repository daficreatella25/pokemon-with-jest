import { shallow, ShallowWrapper } from "enzyme"
import { defineFeature, loadFeature } from "jest-cucumber"
import PokemonDetail from "../../pages/PokemonDetail"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Pages } from "../../types/Navigation"
import { Text, Image, View } from "react-native"
import { PokemonDetailObj } from "../../types/PokemonAbilites"

const feature = loadFeature("./src/__tests__/features/PokemonDetail.feature")

// Mock PokemonServices
jest.mock('../../services/pokemon/pokemon.services', () => {
  return {
    PokemonServices: jest.fn().mockImplementation(() => ({
      getPokemonById: jest.fn().mockResolvedValue({
        id: 1,
        name: 'bulbasaur',
        sprites: { front_default: 'https://example.com/bulbasaur.png' },
        types: [{ type: { name: 'grass' } }],
        stats: [{ base_stat: 45, stat: { name: 'hp' } }],
        abilities: [{ ability: { name: 'overgrow' } }],
      } as PokemonDetailObj),
    })),
  };
});

defineFeature(feature, (test) => {
  let props: NativeStackScreenProps<Pages, "Detail">
  let wrapper: ShallowWrapper

  beforeEach(() => {
    props = {
      navigation: {} as any,
      route: { params: { id: 1 } } as any,
    }
  })

  test("Render Pokemon Detail", ({ given, when, then }) => {
    given("I am on the Pokemon Detail screen", () => {
      wrapper = shallow(<PokemonDetail {...props} />)
    })

    when("I successfully load Pokemon Detail screen", async () => {
      await (wrapper.instance() as PokemonDetail).componentDidMount()
      wrapper.update()
    })

    then("I should see details of the Pokemon", () => {
      expect(wrapper.find(Image).prop('source')).toEqual({ uri: 'https://example.com/bulbasaur.png' })
      expect(wrapper.find(Text).findWhere(n => n.text() === 'bulbasaur').exists()).toBeTruthy()
    })
  })
})