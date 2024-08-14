import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Component, ReactNode } from "react"
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native"
import { Pages } from "../types/Navigation"
import { POKE_API } from "../utils"

export interface Props extends NativeStackScreenProps<Pages, "Detail"> {}

interface State {
  description: string
}
export default class PokemonDetail extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      description: "",
    }
  }

  async componentDidMount() {
    const { name } = this.props.route.params.pokemon
    // set title to pokemon name
    this.props.navigation.setOptions({
      title: name,
    })

    const response = await fetch(`${POKE_API}pokemon-species/${name}`)
    const data = await response.json()
    this.setState({ description: data.flavor_text_entries[0].flavor_text })
  }
  render(): ReactNode {
    const {
      route: {
        params: { pokemon },
      },
    } = this.props

    return (
      <View style={styles.container}>
        <Image
          style={styles.sprite}
          source={{
            uri: pokemon.sprites.other["official-artwork"].front_default,
          }}
        />

        <View>
          <View style={styles.row}>
            <View style={styles.card}>
              <Text>
                <Text style={styles.title} testID="description-title">
                  Dex Entry: {"\n"}
                </Text>
                {this.state.description ? (
                  <Text style={styles.description}>
                    “{this.state.description}”
                  </Text>
                ) : (
                  <ActivityIndicator size="large" style={styles.activity} />
                )}
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.title}>Type: {"\n"}</Text>
              <View style={styles.types}>
                <Text style={styles.type}>{pokemon.types[0].type.name} </Text>
                {pokemon.types[1] && (
                  <Text style={styles.type}>{pokemon.types[1].type.name}</Text>
                )}
              </View>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.card}>
              <Text style={styles.title}>Abilities: {"\n"}</Text>
              <View style={styles.abilities}>
                <Text style={styles.ability}>
                  {pokemon.abilities[0].ability.name}{" "}
                </Text>
                {pokemon.abilities[1] && (
                  <Text style={styles.ability}>
                    {pokemon.abilities[1].ability.name}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.card}>
              <Text style={styles.stat}>Height:</Text>
              <Text style={styles.statValue} testID="height">
                {pokemon.height}
              </Text>
              <Text style={styles.stat}>Weight:</Text>
              <Text style={styles.statValue} testID="weight">
                {pokemon.weight}
              </Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  sprite: {
    margin: 20,
    width: 160,
    height: 160,
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  description: {
    fontWeight: "500",
    textAlign: "justify",
    fontStyle: "italic",
  },
  row: {
    width: Dimensions.get("window").width,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  card: {
    width: Dimensions.get("window").width * 0.45,
    height: Dimensions.get("window").width * 0.5,
    margin: 5,
    borderRadius: 15,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderWidth: 1,
    borderColor: "#D4D4D4",
    padding: 8,
    overflow: "scroll",
  },
  type: {
    textTransform: "uppercase",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 50,
    marginRight: 4,
  },
  types: {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-evenly",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
  stat: {
    fontSize: 17,
    fontWeight: "600",
  },
  statValue: {
    fontWeight: "400",
    paddingBottom: 20,
  },
  abilities: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "space-around",
  },
  ability: {
    textTransform: "capitalize",
    fontWeight: "500",
    paddingVertical: 5,
    fontSize: 15,
  },
  activity: {
    padding: 50,
  },
})

