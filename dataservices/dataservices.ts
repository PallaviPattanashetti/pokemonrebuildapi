

import { PokemonData } from "@/interfaces/interfaces";

export const fetchPokemon = async (nameOrId: string | number): Promise<PokemonData | null> => {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId.toString().toLowerCase()}`);
    if (!res.ok) return null;
    const data = await res.json();

    
    const speciesRes = await fetch(data.species.url);
    const species = await speciesRes.json();
    
    const evoRes = await fetch(species.evolution_chain.url);
    const evoData = await evoRes.json();

    const evoNames: string[] = [];
    let current = evoData.chain;
    
    while (current) {
      evoNames.push(current.species.name);
      current = current.evolves_to[0]; 
    }

    return {
      id: data.id,
      name: data.name,
      img: data.sprites.other["official-artwork"].front_default,
      shinyImg: data.sprites.other["official-artwork"].front_shiny,
      type: data.types.map((t: any) => t.type.name).join(", "),
      abilities: data.abilities.map((a: any) => a.ability.name).join(", "),
      moves: data.moves.slice(0, 5).map((m: any) => m.move.name).join(", "),
      location: "Kanto Region", 
      evolution: evoNames.join(" -> ") 
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};
