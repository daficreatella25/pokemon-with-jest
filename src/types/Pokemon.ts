
import { withPagination } from "./General";

export interface Pokemon {
  id: number
  name: string
  order: string
  sprites: Sprites
  abilities: Ability[]
  types: Type[]
  height: string
  weight: string
}

interface Ability {
  ability: NameUrl
  is_hidden: boolean
  slot: number
}

interface Type {
  type: NameUrl
  slot: number
}

interface Sprites {
  front_default: string
  other: {
    "official-artwork": {
      front_default: string
    }
  }
}

export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: NameUrl[]
}

export interface NameUrl {
  name: string
  url: string
  sprites?: {
    front_default: string
  }
}



export interface pokemonDto {
  offset: number;
  limit: number;
  query?:string
}

// export interface pokemonObj {
//   name: string;
//   sprites?: {
//     front_default: string
//   }
// }

export type pokemonRespObj = withPagination<NameUrl>;



