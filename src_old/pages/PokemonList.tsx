import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Component } from "react"
import { View, StyleSheet, Dimensions, FlatList } from "react-native"
import { Pages } from "../types/Navigation"
import { POKE_API } from "../utils"
import { NameUrl, PokemonListResponse } from "../types/Pokemon"
import PokemonCard from "../components/PokemonCard"

export interface Props extends NativeStackScreenProps<Pages, "List"> {}
export interface State {
  currentUrl: string | null
  pokemonList: NameUrl[]
  isEndReached: boolean
}

export default class PokemonList extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      currentUrl: `${POKE_API}pokemon?limit=10&offset=0`,
      pokemonList: [],
      isEndReached: false,
    }
  }

  async componentDidMount() {
    await this.getPokemons()
  }

  async componentDidUpdate(
    _prevProps: Readonly<Props>,
    prevState: Readonly<State>,
  ) {
    if (prevState.isEndReached !== this.state.isEndReached)
      if (this.state.isEndReached) {
        this.getPokemons()
      }
  }

  async getPokemons() {
    if (this.state.currentUrl) {
      const response = await fetch(this.state.currentUrl)
      const data: PokemonListResponse = await response.json()
      this.setState({
        currentUrl: data.next,
        pokemonList: [...this.state.pokemonList, ...data.results],
        isEndReached: false,
      })
    }
  }

  render() {
    const { navigation } = this.props
    const { pokemonList } = this.state

    return (
      <View style={styles.container}>
        <FlatList
          data={pokemonList}
          numColumns={2}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.contentContainer}
          renderItem={({ item: pokemon }) => (
            <PokemonCard navigation={navigation} pokemon={pokemon} />
          )}
          onEndReached={() => this.setState({ isEndReached: true })}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  pokemon: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 0.5,
    width: "100%",
    height: 50,
    borderColor: "black",
    borderRadius: 3,
    padding: 10,
    marginBottom: 2,
  },
  container: {
    height: Dimensions.get("window").height,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    width: Dimensions.get("window").width,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#00FFFF",
    fontWeight: "500",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
})

