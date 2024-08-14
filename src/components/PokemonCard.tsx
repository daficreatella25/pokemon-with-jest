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
import React from "react"
import { COLORS } from "../styles/colors"
import Spacer from "./Spacer"
import { getPokemonImage } from "../services/main"

export interface PokemonCardProps {
    data: NameUrl
    id: number
    navigation: NativeStackNavigationProp<Pages, "List", undefined>
}

interface State {
  pokemonData?: Pokemon
}
export default class PokemonCard extends Component<PokemonCardProps, State> {
  constructor(props: PokemonCardProps) {
    super(props)
  }

  async componentDidMount() {
  }

  render() {
    const { navigation, data, id  } = this.props
    const item = data

    const imageUrl = data?.sprites?.front_default ? data?.sprites?.front_default : getPokemonImage(id)


    function extractPokemonNumber(url: string) {
        const match = url.match(/\/(\d+)\.png$/);
        
        if (match && match[1]) {
            return parseInt(match[1], 10);
        }
        return null;
    }

    return (
        <View style={styles.container}>
            <Pressable 
                onPress={() =>
                navigation.navigate("Detail", {
                    id: extractPokemonNumber(imageUrl) as number,
                })
                }
                key={item.name} style={styles.pokemonCard}>
                <View >
                <View key={item.name}>
                    {
                    data?.sprites?.front_default ? 
                        <Image
                        source={{ uri: imageUrl }}
                        style={styles.pokemonCardImage}
                        />
                    :
                        <Image
                        source={{ uri: imageUrl }}
                        style={styles.pokemonCardImage}
                        />
                    }

                    <Text style={styles.pokemonCardText}>{item.name}</Text>

                    <Spacer heigth={20}/>
                </View>
                </View>
            </Pressable>
        </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      width: '50%',
    },
    pokemonCard: {
      backgroundColor: COLORS.gray1,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10
    },
    pokemonCardImage: {
      width: 80,
      height: 80
    },
    pokemonCardText: {
      color: COLORS.white,
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    }
  });
