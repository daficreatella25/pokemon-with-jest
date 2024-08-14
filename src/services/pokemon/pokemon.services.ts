
import { NameUrl, pokemonDto, pokemonRespObj } from "../../types/Pokemon";
import { abilitesObj, PokemonDetailObj } from "../../types/PokemonAbilites";
import { ENDPOINT, apiInstance } from "../main";

export class PokemonServices {
  async getPokemonByPage(param: pokemonDto) {
    let endpoint = `${ENDPOINT.pokemon}?offset=${param.offset}&limit=${param.limit}`;
    const res = await apiInstance.get<pokemonRespObj, unknown>(endpoint);
  
    if (!res.ok) throw res;

    return res.data;
    
  }

  async getPokemonByName(param: pokemonDto) {
    const endpoint = `${ENDPOINT.pokemon}/${param.query}`
    const res = await apiInstance.get<NameUrl, unknown>(endpoint);

    if (!res.ok) throw res;

    return res.data;
  }

  async getPokemonById(id: number){
    const endpoint = `${ENDPOINT.pokemonDetail(id.toString())}`;

    const res = await apiInstance.get<PokemonDetailObj, unknown>(endpoint)

    if(!res.ok)  throw res

    return res.data
  }
}

export const pokemonSerivces = new PokemonServices()
