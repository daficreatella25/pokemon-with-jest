import { create } from "apisauce"

export const apiInstance = create({
    baseURL: "https://pokeapi.co/api/v2/",
})

export const ENDPOINT = {
    pokemon: "pokemon",
    pokemonDetail: (id: string) => `pokemon/${id}`,
}

export const getPokemonImage = (index: number) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${index}.png`
