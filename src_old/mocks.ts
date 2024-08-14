import { Pokemon, PokemonListResponse } from "./types/Pokemon"

export const pokemonListResponseMock: PokemonListResponse = {
  count: 2,
  next: null,
  previous: null,
  results: [
    { name: "bulbasaur", url: "sample-url" },
    { name: "ivysaur", url: "sample-url" },
  ],
}

export const pokemonDetailResponseMock = {
  flavor_text_entries: [
    {
      flavor_text: "sample description",
    },
  ],
}

export const pokemonMock: Pokemon = {
  id: 1,
  name: "bulbasaur",
  order: "1",
  sprites: {
    front_default:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
    other: {
      "official-artwork": {
        front_default:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
      },
    },
  },
  abilities: [
    { ability: { name: "overgrow", url: "" }, is_hidden: false, slot: 1 },
    { ability: { name: "chlorophyll", url: "" }, is_hidden: false, slot: 2 },
  ],
  types: [
    { slot: 1, type: { name: "grass", url: "" } },
    { slot: 2, type: { name: "poison", url: "" } },
  ],
  height: "3",
  weight: "20",
}

