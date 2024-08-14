export interface abilityObj{
    ability: {
        name: string,
        url:string
    }
}

export interface abilitesObj{
    abilities: abilityObj[]
}


// File: types/pokemon.ts

export interface PokemonDetailObj {
    id: number;
    name: string;
    sprites: {
      front_default: string;
      back_default: string;
      front_shiny: string;
      back_shiny: string;
    };
    stats: Array<{
      base_stat: number;
      effort: number;
      stat: {
        name: string;
        url: string;
      };
    }>;
    types: Array<{
      slot: number;
      type: {
        name: string;
        url: string;
      };
    }>;
    abilities: Array<{
      ability: {
        name: string;
        url: string;
      };
      is_hidden: boolean;
      slot: number;
    }>;
    height: number;
    weight: number;
    base_experience: number;
    species: {
      name: string;
      url: string;
    };
  }
  
  // You might also want to define some utility types for reusable parts
  export interface NameUrlPair {
    name: string;
    url: string;
  }
  
  export interface PokemonStat {
    base_stat: number;
    effort: number;
    stat: NameUrlPair;
  }
  
  export interface PokemonType {
    slot: number;
    type: NameUrlPair;
  }
  
  export interface PokemonAbility {
    ability: NameUrlPair;
    is_hidden: boolean;
    slot: number;
  }