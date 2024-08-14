import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Component, ReactNode } from "react"
import {
  StyleSheet,
  Dimensions,
} from "react-native"
import { Pages } from "../types/Navigation"
import React from "react"
import { PokemonServices } from "../services/pokemon/pokemon.services"

export interface Props extends NativeStackScreenProps<Pages, "Detail"> {}

interface State {
  description: string
}
export default class PokemonDetail extends Component<Props, State> {
  private pokemonServices
  constructor(props: Props) {
    super(props)
    this.state = {
      description: "",
    }

    this.pokemonServices = new PokemonServices()
  }

  async componentDidMount() {

  }

  render(): ReactNode {
    const {
      route: {
        params: { pokemon },
      },
    } = this.props

    return (
      <></>
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

