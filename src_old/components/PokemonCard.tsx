import { Component } from "react"
import {
  Pressable,
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Pages } from "../types/Navigation"
import { NameUrl, Pokemon } from "../types/Pokemon"

export interface PokemonCardProps {
  navigation: NativeStackNavigationProp<Pages, "List", undefined>
  pokemon: NameUrl
}

interface State {
  pokemonData?: Pokemon
}
export default class PokemonCard extends Component<PokemonCardProps, State> {
  constructor(props: PokemonCardProps) {
    super(props)
    this.state = {
      pokemonData: undefined,
    }
  }

  async componentDidMount() {
    const {
      pokemon: { url },
    } = this.props
    if (url) {
      const response = await fetch(url)
      const pokemonData: Pokemon = await response.json()
      this.setState({ pokemonData })
    }
  }

  render() {
    const { navigation } = this.props

    return this.state.pokemonData ? (
      <Pressable
        onPress={() =>
          navigation.navigate("Detail", {
            pokemon: this.state.pokemonData as Pokemon,
          })
        }>
        <View style={styles.container}>
          <Text style={styles.name}>{this.state.pokemonData.name}</Text>
          <Image
            style={styles.sprite}
            source={{ uri: this.state.pokemonData.sprites.front_default }}
          />
        </View>
      </Pressable>
    ) : (
      <View style={styles.container}>
        <ActivityIndicator size="small" />
      </View>
    )
  }
}

const size = Dimensions.get("window").width * 0.4

const styles = StyleSheet.create({
  name: {
    textTransform: "capitalize",
  },
  container: {
    width: size,
    height: size,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    marginVertical: 4,
    marginHorizontal: 6,
    borderRadius: 15,
  },
  sprite: {
    width: 100,
    height: 100,
  },
})

