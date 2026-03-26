export interface Pokemon {
    id:number
    name: string
    img: string
    shinyImg:string
    moves: string
 location: string
    type:string
    abilities:string
    evolution:string
    habitat:string

}

export interface PokemonContextType {
    pokemon: Pokemon | null;
    setPokemon: (pokemon: Pokemon | null) => void

}