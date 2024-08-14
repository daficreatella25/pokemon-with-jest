import React, { Component } from "react"
import { View, StyleSheet, FlatList, TextInput, ListRenderItem, Text, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Pages } from "../types/Navigation"
import { POKE_API } from "../utils"
import { NameUrl, pokemonObj } from "../types/Pokemon"
import PokemonCard from "../components/PokemonCard"
import { COLORS } from "../styles/colors"
import { SCREEN_WIDTH } from "../constant/constant"
import { PokemonServices } from "../services/pokemon/pokemon.services"
import Spacer from "../components/Spacer"
import { globalStyles } from "../styles/global"

export interface Props extends NativeStackScreenProps<Pages, "List"> {}
export interface State {
  pokemonList: NameUrl[]
  isLoading: boolean
  query: string
  page: number
}

const LIMIT = 20
const DEBOUNCE_DELAY = 300

export default class PokemonList extends Component<Props, State> {
  private pokemonServices: PokemonServices
  private debounceTimeout: NodeJS.Timeout | null = null


  constructor(props: Props) {
    super(props)
    this.state = {
      pokemonList: [],
      isLoading: false,
      query: '',
      page: 0
    }

    this.pokemonServices = new PokemonServices()
  }

  componentDidMount() {
    this.loadPokemon()
  }

  loadPokemon = async () => {
    if (this.state.isLoading) return

    this.setState({ isLoading: true })

    try {
      if(this.state.query === ''){
        console.log('masok')
        const response = await this.pokemonServices.getPokemonByPage({
          offset: this.state.page * LIMIT,
          limit: LIMIT,
          query: this.state.query
        })

        this.setState(prevState => ({
          pokemonList: [...prevState.pokemonList, ...response.results],
          page: prevState.page + 1,
          isLoading: false
        }))

      }else{
        const response = await this.pokemonServices.getPokemonByPage({
          offset: this.state.page * LIMIT,
          limit: LIMIT,
          query: this.state.query
        })

        const single = response as NameUrl

        if(single){
          this.setState(() => ({
            pokemonList: [single],
            page: 1,
            isLoading: false
          }))
        }

        
      }

    } catch (error) {
      console.error("Error loading Pokemon:", error)
      this.setState({ isLoading: false })
    }
  }

  handleQueryChange = (query: string) => {
    this.setState({ query })
    
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout)
    }

    this.debounceTimeout = setTimeout(() => {
      this.setState({ pokemonList: [], page: 0 }, this.loadPokemon)
    }, DEBOUNCE_DELAY)
  }

  renderItem: ListRenderItem<pokemonObj> = ({ item, index }) => {
    return (
      <PokemonCard
        data-testid="pokemon-item"
        data={item}
        id={index + 1}
      />
    )
  }

  renderFooter = () => {
    if (!this.state.isLoading) return <Spacer heigth={20}/>
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    )
  }

  render() {
    const { query, pokemonList, isLoading } = this.state

    return (
      <SafeAreaView style={[globalStyles.screen, styles.container]}>
        <TextInput 
          style={styles.textInputContainer}
          placeholder="Search"
          onChangeText={this.handleQueryChange} 
          value={query}
        />
        
        <Spacer heigth={40}/>
        
        <FlatList
          data={pokemonList}
          renderItem={this.renderItem}
          numColumns={2}
          onEndReached={this.loadPokemon}
          onEndReachedThreshold={0.5}
          ListFooterComponent={this.renderFooter}
          ItemSeparatorComponent={() => <Spacer width={20} heigth={20} />}
          contentContainerStyle={styles.listContainer}
          keyExtractor={(item, index) => `${item.name}-${index}`}
        />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  textInputContainer: {
    width: '60%',
    backgroundColor: COLORS.gray1,
    borderRadius: 4,
    height: 40,
    color: COLORS.white,
    paddingLeft: 10
  },
  loader: {
    marginVertical: 20,
    alignItems: 'center'
  }
})