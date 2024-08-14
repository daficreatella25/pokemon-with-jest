import React, { Component } from "react"
import { View, StyleSheet, FlatList, TextInput, Text, ActivityIndicator, Pressable, SafeAreaView } from "react-native"

import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Pages } from "../types/Navigation"
import { NameUrl } from "../types/Pokemon"
import PokemonCard from "../components/PokemonCard"
import { COLORS } from "../styles/colors"
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
const PAGE_OPTION = [1,2,3,4]

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
        const response = await this.pokemonServices.getPokemonByPage({
          offset: this.state.page * LIMIT,
          limit: LIMIT,
          query: this.state.query
        })

        if(response?.results){
          this.setState(prevState => ({
            pokemonList: [...prevState.pokemonList, ...response?.results],
            page: prevState.page + 1,
            isLoading: false
          }))
        }
      }else{
        const response = await this.pokemonServices.getPokemonByName({
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

  renderFooter = () => {
    if (!this.state.isLoading) return <Spacer heigth={20}/>
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    )
  }

  handlePage = (selectedPage:number) => {
    this.setState({
      page: selectedPage - 1,
      pokemonList: []
    }, this.loadPokemon)
  }

  render() {
    const { query, pokemonList } = this.state

    return (
      <SafeAreaView style={[globalStyles.screen, styles.container]}>
        <TextInput 
          style={styles.textInputContainer}
          placeholder="Search"
          onChangeText={this.handleQueryChange} 
          value={query}
        />
        <Spacer heigth={20}/>

        <View style={styles.paginationContainer}>
        {
          PAGE_OPTION.map((item)=> (
            <Pressable onPress={()=>this.handlePage(item)} key={item} style={styles.paginationBtn}>
              <Text style={styles.paginationText}>
                {item}
              </Text>
            </Pressable>
          ))
        }
      </View>
        
        <Spacer heigth={40}/>
        
        <FlatList
          data={pokemonList}
          renderItem={({item, index})=> {
            const {navigation} = this.props
            return (
              <PokemonCard
                navigation={navigation}
                data={item}
                id={(index + 1) + (((this.state.page - 1) * LIMIT))}
              />
            )
          }}
          numColumns={2}
          // this note behave correctly on expo browser, 
          // cant use emulator because cant run on really old expo version
          // onEndReached={this.loadPokemon}
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
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: 'space-between'
  },
  paginationText:{
    color: COLORS.white,
    textAlign: 'center'
  },
  paginationBtn:{
    backgroundColor: COLORS.gray1,
    width: 22,
    height: 22,
    borderRadius: 2,
    borderColor: COLORS.white,
    borderWidth: 1,
    marginRight: 10
  },
})