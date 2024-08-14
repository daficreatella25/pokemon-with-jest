
import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import Spacer from './Spacer';
import { getPokemonImage } from '../services/main';
import { SCREEN_WIDTH } from '../constant/constant';
import { COLORS } from '../styles/colors';
import { pokemonObj } from '../types/Pokemon';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pages } from '../types/Navigation';

interface Props {
  data: pokemonObj
  id: number
  navigation: NativeStackNavigationProp<Pages, "List", undefined>
}

export const PokemonCard = (props:Props): JSX.Element => {
  const item = props.data

  function extractPokemonNumber(url: string) {
    const match = url.match(/\/(\d+)\.png$/);
    
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    return null;
  }

  const imageUrl = props.data?.sprites?.front_default ? props.data?.sprites?.front_default : getPokemonImage(props.id)

  return (
    <View style={styles.container}>
      <Pressable 
        onPress={() =>
          props.navigation.navigate("Detail", {
            id: extractPokemonNumber(imageUrl) as number,
          })
        }
        key={item.name} style={styles.pokemonCard}>
        <View >
          <View key={item.name}>
            {
              props.data?.sprites?.front_default ? 
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
};

export default PokemonCard;


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