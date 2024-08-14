import { shallow, ShallowWrapper } from "enzyme"
import { defineFeature, loadFeature } from "jest-cucumber"
import PokemonCard, { PokemonCardProps } from "../../components/PokemonCard"
import { mockFetch } from "../../utils"
import { pokemonMock } from "../../mocks"

const feature = loadFeature("./src/__tests__/features/PokemonCard.feature")

defineFeature(feature, (test) => {
  let props: PokemonCardProps
  const navigateFn = jest.fn()
  beforeEach(() => {
    props = {
      navigation: { navigate: navigateFn } as any,
      pokemon: {
        name: "bulbasaur",
        url: "https://pokeapi.co/api/v2/pokemon/1",
      },
    }
    window.fetch = mockFetch(pokemonMock)
  })

  test("Render Pokemon Card", ({ given, when, then }) => {
    let wrapper: ShallowWrapper
    given("I am on a Pokemon Card", () => {
      wrapper = shallow(<PokemonCard {...props} />)
    })

    then("I should see a loading indicator", () => {
      expect(wrapper.find("ActivityIndicator")).toHaveLength(1)
    })

    when("the Pokemon data is loaded", async () => {
      wrapper.update()
    })

    then("I should see the Pokemon name and sprite", () => {
      expect(wrapper.find("Text").text()).toBe(pokemonMock.name)
      expect(wrapper.find("Image").prop("source")).toEqual({
        uri: pokemonMock.sprites.front_default,
      })
    })

    when("I click the Pokemon Card", () => {
      wrapper.find("Pressable").simulate("press")
    })

    then("I should navigate to Details Screen", () => {
      expect(navigateFn).toHaveBeenCalled()
    })
  })
})

