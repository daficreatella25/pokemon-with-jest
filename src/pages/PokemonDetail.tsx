import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Component, ReactNode } from "react"
import {
    StyleSheet,
    Dimensions,
    Image,
    Text,
    View,
    ScrollView,
    SafeAreaView,
} from "react-native"
import { Pages } from "../types/Navigation"
import React from "react"
import { PokemonServices } from "../services/pokemon/pokemon.services"
import { PokemonAbility, PokemonDetailObj, PokemonStat, PokemonType } from "../types/PokemonAbilites"
import { globalStyles } from "../styles/global"

export interface Props extends NativeStackScreenProps<Pages, "Detail"> {
}

interface State {
    data?: PokemonDetailObj
}

export default class PokemonDetail extends Component<Props, State> {
    private pokemonServices

    constructor(props: Props) {
        super(props)
        this.state = {
            data: undefined,
        }

        this.pokemonServices = new PokemonServices()
    }

    async componentDidMount() {
        this.loadPokemon()
    }

    loadPokemon = async () => {
        const {
            route: {
                params: { id },
            },
        } = this.props

        const res = await this.pokemonServices.getPokemonById(id)

        if (res) {
            this.setState({ data: res })
        }

    }

    render(): ReactNode {
        const pokemonDetail = this.state.data

        return (
            <SafeAreaView style={[globalStyles.screen, styles.container]}>
                <ScrollView>
                    {pokemonDetail?.sprites?.front_default && (
                        <Image
                            source={{ uri: pokemonDetail.sprites.front_default }}
                            style={styles.sprite}
                        />
                    )}

                    <Text style={styles.name}>{pokemonDetail?.name}</Text>

                    <View style={styles.typesContainer}>
                        {pokemonDetail?.types?.map((item: PokemonType) => (
                            <Text key={item.type.name} style={styles.type}>
                                {item.type.name}
                            </Text>
                        ))}
                    </View>

                    <View style={styles.statsContainer}>
                        <Text style={styles.sectionTitle}>Stats:</Text>
                        {pokemonDetail?.stats?.map((item: PokemonStat) => (
                            <Text key={item.stat.name} style={styles.stat}>
                                {item.stat.name}: {item.base_stat}
                            </Text>
                        ))}
                    </View>

                    <View style={styles.abilitiesContainer}>
                        <Text style={styles.sectionTitle}>Abilities:</Text>
                        {pokemonDetail?.abilities?.map((item: PokemonAbility) => (
                            <Text key={item.ability.name} style={styles.ability}>
                                {item.ability.name}
                            </Text>
                        ))}
                    </View>

                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    sprite: {
        width: 200,
        height: 200,
        alignSelf: "center",
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 16,
        color: "white",
    },
    typesContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 16,
    },
    type: {
        padding: 8,
        marginHorizontal: 4,
        backgroundColor: "#e0e0e0",
        borderRadius: 4,
    },
    statsContainer: {
        marginBottom: 16,
    },
    abilitiesContainer: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
        color: "white",
    },
    stat: {
        fontSize: 16,
        marginBottom: 4,
        color: "white",
    },
    ability: {
        fontSize: 16,
        marginBottom: 4,
        color: "white",
    },
    additionalInfo: {
        color: "white",
    },
})

