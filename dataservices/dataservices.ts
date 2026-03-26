// import { PokemonData } from "@/interfaces/interfaces";

// export const fetchPokemon = async (nameOrId: string | number): Promise<PokemonData | null> => {
//   try {
//     const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId.toString().toLowerCase()}`);
//     if (!res.ok) return null;
//     const data = await res.json();

    
//     const speciesRes = await fetch(data.species.url);
//     const species = await speciesRes.json();
    
//     const evoRes = await fetch(species.evolution_chain.url);
//     const evoData = await evoRes.json();

//     const evoNames: string[] = [];
//     let current = evoData.chain;
    
//     while (current) {
//       evoNames.push(current.species.name);
//       current = current.evolves_to[0]; 
//     }

//     return {
//       id: data.id,
//       name: data.name,
//       img: data.sprites.other["official-artwork"].front_default,
//       shinyImg: data.sprites.other["official-artwork"].front_shiny,
//       type: data.types.map((t: any) => t.type.name).join(", "),
//       abilities: data.abilities.map((a: any) => a.ability.name).join(", "),
//       moves: data.moves.slice(0, 5).map((m: any) => m.move.name).join(", "),
//       location: "Kanto Region", 
//       evolution: evoNames.join(" -> ") 
//     };
//   } catch (error) {
//     console.error("Fetch error:", error);
//     return null;
//   }
// };





import { PokemonData } from "@/interfaces/interfaces";

export const fetchPokemon = async (nameOrId: string | number): Promise<PokemonData | null> => {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId.toString().toLowerCase()}`);
    if (!res.ok) return null;
    const data = await res.json();

    // 1. Fetch Species and Evolution Chain
    const speciesRes = await fetch(data.species.url);
    const species = await speciesRes.json();
    
    const evoRes = await fetch(species.evolution_chain.url);
    const evoData = await evoRes.json();

    // 2. Extract Evolution Names and Images
    const evoNames: string[] = [];
    const evolutionImages: string[] = [];
    let current = evoData.chain;
    
    while (current) {
      const name = current.species.name;
      evoNames.push(name);
      
      // Fetching the sprite for each evolution stage
      const evoPokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      if (evoPokemonRes.ok) {
        const evoPokemonData = await evoPokemonRes.json();
        evolutionImages.push(evoPokemonData.sprites.other["official-artwork"].front_default);
      }
      
      current = current.evolves_to[0]; 
    }

    // 3. Fetch Location Area Encounters (Optional but better than hardcoded Kanto)
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
      // Fixed: Replaced 'any' with specific PokeAPI types
      type: data.types.map((t: { type: { name: string } }) => t.type.name).join(", "),
      abilities: data.abilities.map((a: { ability: { name: string } }) => a.ability.name).join(", "),
      moves: data.moves.slice(0, 5).map((m: { move: { name: string } }) => m.move.name).join(", "),
      location: locationName, 
      evolution: evoNames.join(" -> "),
      evolutionImages: evolutionImages // Matches the array map in your page.tsx
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};