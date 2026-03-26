
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
    const evolutionImages: string[] = [];
    let current = evoData.chain;
    
    while (current) {
      const name = current.species.name;
      evoNames.push(name);
      
     
      const evoPokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      if (evoPokemonRes.ok) {
        const evoPokemonData = await evoPokemonRes.json();
        evolutionImages.push(evoPokemonData.sprites.other["official-artwork"].front_default);
      }
      
      current = current.evolves_to[0]; 
    }

    const locationRes = await fetch(data.location_area_encounters);
    const locations = await locationRes.json();
    const locationName = locations.length > 0 
      ? locations[0].location_area.name.replace(/-/g, " ") 
      : "Unknown Location";

    return {
      id: data.id,
      name: data.name,
      img: data.sprites.other["official-artwork"].front_default,
      shinyImg: data.sprites.other["official-artwork"].front_shiny,

      type: data.types.map((t: { type: { name: string } }) => t.type.name).join(", "),
      abilities: data.abilities.map((a: { ability: { name: string } }) => a.ability.name).join(", "),
      moves: data.moves.slice(0, 5).map((m: { move: { name: string } }) => m.move.name).join(", "),
      location: locationName, 
      evolution: evoNames.join(" -> "),
      evolutionImages: evolutionImages 
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};