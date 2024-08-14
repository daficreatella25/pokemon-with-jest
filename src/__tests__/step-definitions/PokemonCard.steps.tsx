import { shallow, ShallowWrapper } from "enzyme"
import { defineFeature, loadFeature } from "jest-cucumber"
import PokemonCard, { PokemonCardProps } from "../../components/PokemonCard"
import { Image, Text, Pressable } from "react-native"
import { getPokemonImage } from "../../services/main"

// Mock the getPokemonImage function
jest.mock("../../services/main", () => ({
  getPokemonImage: jest.fn((id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`)
}))

const feature = loadFeature("./src/__tests__/features/PokemonCard.feature")

defineFeature(feature, (test) => {
  let props: PokemonCardProps
  const navigateFn = jest.fn()
  let wrapper: ShallowWrapper

  beforeEach(() => {
    props = {
      navigation: { navigate: navigateFn } as any,
      data: {
        name: "Pikachu",
        url: 'https://pokeapi.co/api/v2/pokemon/1/'
      },
      id: 1
    }
  })

  test("Render Pokemon Card", ({ given, when, then }) => {
    given("I am on a Pokemon Card", () => {
      wrapper = shallow(<PokemonCard {...props} />)
    })

    then("I should see the Pokemon name and sprite", () => {
      expect(wrapper.find(Text).at(0).prop('children')).toBe(props.data.name)
      const image = wrapper.find(Image)
      expect(image.exists()).toBeTruthy()
      expect(image.prop("source")).toEqual({
        uri: getPokemonImage(props.id)
      })
    })

    when("I click the Pokemon Card", () => {
      wrapper.find(Pressable).simulate("press")
    })

    then("I should navigate to Details Screen", () => {
      expect(navigateFn).toHaveBeenCalledWith("Detail", { id: 1 })
    })
  })
})