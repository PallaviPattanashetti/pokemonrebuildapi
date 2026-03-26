
// export const fetchPokemon = async (nameOrId: string | number) => {
//   const idOrName = nameOrId.toString().toLowerCase();

import { PokemonData } from "@/interfaces/interfaces";

//   try {
   
//     const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);
//     if (!res.ok) return null;
//     const data = await res.json();

//     if (data.id > 649) {
//       alert("Only Pokemon from Generations 1-5 (National Pokedex 1-649) are allowed!");
//       return null;
//     }

  
//     const speciesRes = await fetch(data.species.url);
//     const species = await speciesRes.json();

//     const evoRes = await fetch(species.evolution_chain.url);
//     const evo = await evoRes.json();

//     const evoNames: string[] = [];
//     let node = evo.chain;
//     while (node) {
//       evoNames.push(node.species.name);
//       node = node.evolves_to?.[0];
//     }

   
//     const locRes = await fetch(data.location_area_encounters);
//     const loc = await locRes.json();
//     const firstLocation = loc[0]?.location_area?.name
//       ? loc[0].location_area.name.replace(/-/g, " ")
//       : "N/A";

//     return {
//       id: data.id,
//       name: data.name,
//       img: data.sprites.other["official-artwork"].front_default,
//       shinyImg: data.sprites.other["official-artwork"].front_shiny,
//       type: data.types.map((t: any) => t.type.name).join(", "),
//       abilities: data.abilities.map((a: any) => a.ability.name).join(", "),
//       moves: data.moves.slice(0, 10).map((m: any) => m.move.name).join(", "),
//       location: firstLocation,
//       evolution: evoNames.length > 1 ? evoNames.join(" -> ") : "N/A",
//     };
//   } catch (err) {
//     console.error("Error fetching Pokemon:", err);
//     return null;
//   }
// };





export const fetchPokemon = async (nameOrId: string | number): Promise<PokemonData | null> => {
  const idOrName = nameOrId.toString().toLowerCase();

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);
    if (!res.ok) return null;
    const data = await res.json();

   
    if (data.id > 649) {
      console.warn("Generation limit exceeded (1-649 only).");
      return null;
    }

    
    const [speciesRes, locRes] = await Promise.all([
      fetch(data.species.url),
      fetch(data.location_area_encounters)
    ]);

    const species = await speciesRes.json();
    const loc = await locRes.json();

    
    const evoRes = await fetch(species.evolution_chain.url);
    const evo = await evoRes.json();

    const evoNames: string[] = [];
    let node = evo.chain;
    while (node) {
      evoNames.push(node.species.name);
      
      node = node.evolves_to?.[0];
    }

    const firstLocation = loc[0]?.location_area?.name
      ? loc[0].location_area.name.replace(/-/g, " ")
      : "N/A";

    return {
      id: data.id,
      name: data.name,
      img: data.sprites.other["official-artwork"].front_default,
      shinyImg: data.sprites.other["official-artwork"].front_shiny,
      type: data.types.map((t: { type: { name: string } }) => t.type.name).join(", "),
      abilities: data.abilities.map((a: { ability: { name: string } }) => a.ability.name).join(", "),
      moves: data.moves.slice(0, 10).map((m: { move: { name: string } }) => m.move.name).join(", "),
      location: firstLocation,
      evolution: evoNames.length > 1 ? evoNames.join(" -> ") : "N/A",
    };
  } catch (err) {
    console.error("Error fetching Pokemon:", err);
    return null;
  }
};