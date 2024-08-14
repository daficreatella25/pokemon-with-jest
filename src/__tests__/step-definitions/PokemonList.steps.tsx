import { shallow, ShallowWrapper } from "enzyme"
import { defineFeature, loadFeature } from "jest-cucumber"
import { PokemonList, PokemonListProps, PokemonListState } from "../../pages"
import { mockFetch } from "../../utils"
import { pokemonListResponseMock } from "../../mocks"
import { FlatListProps } from "react-native"
import { NameUrl } from "../../types/Pokemon"

const feature = loadFeature("./src/__tests__/features/PokemonList.feature")

defineFeature(feature, (test) => {
  let props: PokemonListProps
  let wrapper: ShallowWrapper
  let instance: PokemonList

  beforeEach(() => {
    jest.resetModules()
    props = {
      navigation: {
        dispatch: jest.fn(),
      },
      route: {},
    } as unknown as PokemonListProps
    window.fetch = mockFetch(pokemonListResponseMock)
    wrapper = shallow(<PokemonList {...props} />)
    instance = wrapper.instance() as PokemonList
  })

  test("Render Pokemon List", ({ given, when, then }) => {
    given("I am on the Pokemon List screen", () => {
      // No need to do anything here since beforeEach already handles it
    })

    when("I successfully load Pokemon List screen", async () => {
      instance.componentDidMount()
      wrapper.update()
    })

    then("I should see a list of Pokemon", () => {
      const updatedFlatListProps = wrapper
        .find("FlatList")
        .props() as FlatListProps<NameUrl>
      expect(updatedFlatListProps.data?.length).toEqual(2)
    })

    when("I scroll down to end", async () => {
      // scroll to end
      const updatedFlatListProps = wrapper
        .find("FlatList")
        .props() as FlatListProps<NameUrl>
      const scrollDownToEndFn = updatedFlatListProps.onEndReached
      scrollDownToEndFn?.({ distanceFromEnd: 0 })

      // update component state
      wrapper.setState({
        pokemonList: [
          ...pokemonListResponseMock.results,
          ...[
            {
              name: "venasaur",
              url: "mock-url",
            },
            {
              name: "charmander",
              url: "mock-url",
            },
          ],
        ],
      })
    })

    then("I should see more Pokemon", () => {
      const updatedFlatListProps = wrapper
        .find("FlatList")
        .props() as FlatListProps<NameUrl>
      expect(updatedFlatListProps.data?.length).toEqual(4)
    })
  })
})

