import React, { Component } from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { Pages } from "./src/types/Navigation"
import { NavigationContainer } from "@react-navigation/native"
import { PokemonList, PokemonDetail } from "./src/pages"
import { COLORS } from "./src/styles/colors"

const RootStack = createStackNavigator<Pages>()
export default class App extends Component<{}, {}> {
  constructor(props: {}) {
    super(props)
  }

  render() {
    return (
      <NavigationContainer>
        <RootStack.Navigator initialRouteName="List">
          <RootStack.Screen
            name="List"
            component={PokemonList}
            options={{
              title: "Pokedex",
              headerStyle: { backgroundColor: COLORS.background },
              headerTintColor: "white",
            }}
          />
          <RootStack.Screen
            name="Detail"
            component={PokemonDetail}
            options={{
              headerStyle: { backgroundColor: COLORS.background },
              headerTitleStyle: { color: "white", textTransform: "capitalize" },
              headerTintColor: "white",
            }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    )
  }
}

