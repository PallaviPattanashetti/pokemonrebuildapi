"use client";

import { fetchPokemon } from "@/dataservices/dataservices";
import React, { useState } from "react";
export default function FetchPage() {
  const [search, setSearch] = useState("");
  const [pokemon, setPokemon] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!search) return;
    const data = await fetchPokemon(search);
    if (data) setPokemon(data);
  };

  const handleRandom = async () => {
    const randomId = Math.floor(Math.random() * 649) + 1;
    const data = await fetchPokemon(randomId);
    if (data) setPokemon(data);
  };

  const toggleFavorite = () => {
    if (!pokemon) return;
    const alreadyExists = favorites.find((f) => f.id === pokemon.id);
    if (alreadyExists) {
      setFavorites(favorites.filter((f) => f.id !== pokemon.id));
    } else if (favorites.length < 6) {
      setFavorites([...favorites, pokemon]);
    }
  };

  return (
    <div
      className="text-white font-sans min-h-screen pb-20 bg-fixed bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/Background.png')" }}
    >
      <header className="flex flex-col items-center pt-10 px-4">
        <h1 className="text-[#d92727] text-4xl md:text-5xl font-bold mb-6 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] text-center">
          WelCome To Pokemon World
        </h1>
        
        <div className="flex items-center gap-4 w-full max-w-md mb-6">
          <input 
            type="text" 
            className="w-full bg-[#1a2b4b]/90 border border-white rounded-md px-4 py-2 text-sm focus:outline-none placeholder:text-gray-400 text-white" 
            placeholder="Search by Name and Id...."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button onClick={toggleFavorite} className="bg-white p-1 rounded-sm hover:bg-gray-200 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" 
                 fill={favorites.find(f => f.id === pokemon?.id) ? "red" : "none"} 
                 stroke="currentColor" strokeWidth="2" className="text-black transition-all">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>

        <button onClick={handleRandom} className="border border-white bg-[#1a2b4b]/60 px-8 py-2 rounded-md text-xl font-medium hover:bg-white hover:text-[#1a2b4b] transition-colors">
          Random Pokemon
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-12 space-y-10">

       
        <section className="bg-[#1e40af]/30 backdrop-blur-md p-8 rounded-lg shadow-2xl border border-white/10">
          <h2 className="text-2xl font-bold mb-8 text-center">My ultimate Pokémon lineup</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-sm aspect-square flex items-center justify-center overflow-hidden border border-gray-400">
                {favorites[i] ? (
                  <img src={favorites[i].img} className="w-full h-full object-contain" alt="pokemon" />
                ) : (
                  <span className="text-gray-400 text-[10px] font-bold">EMPTY</span>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#1e40af]/30 backdrop-blur-md p-10 rounded-lg shadow-2xl flex flex-col items-center min-h-[420px]">
          <h3 className="text-2xl font-bold mb-8 capitalize">Name: {pokemon?.name || "???"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-center">
            <div className="bg-white p-2 rounded-sm max-w-60 mx-auto border border-white aspect-square flex items-center justify-center w-full">
              {pokemon && <img src={pokemon.img} className="w-full h-auto object-contain scale-125" alt={pokemon.name} />}
            </div>
            <div className="text-center">
              <span className="text-2xl font-medium capitalize tracking-wider">{pokemon?.type || "---"}</span>
              {pokemon?.shinyImg && (
                <div className="mt-4">
                  <img src={pokemon.shinyImg} className="h-20 mx-auto" alt="shiny" />
                  <p className="text-yellow-400 text-[10px] font-bold">SHINY FORM</p>
                </div>
              )}
            </div>
            <div className="border-2 border-white p-6 h-full min-h-[150px] flex flex-col justify-start bg-black/10">
              <h4 className="text-xl font-bold mb-4">Abilities:</h4>
              <div className="text-lg leading-relaxed space-y-1 capitalize">
                {pokemon?.abilities || "---"}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#1e40af]/30 backdrop-blur-md p-10 rounded-lg shadow-2xl min-h-[150px]">
          <h4 className="text-2xl font-bold mb-6 border-b border-white/40 pb-2 inline-block">Moves:</h4>
          <p className="text-sm text-slate-100 capitalize leading-relaxed">
            {pokemon?.moves || ""}
          </p>
        </section>

        <section className="bg-[#1e40af]/30 backdrop-blur-md p-10 rounded-lg shadow-2xl text-center min-h-[200px]">
          <h5 className="text-2xl font-bold mb-10 text-white">Evolution Path</h5>
          <div className="flex justify-center items-center gap-6 flex-wrap">
            {pokemon?.evolutionImages ? (
              pokemon.evolutionImages.map((evoImg: string, index: number) => (
                <div key={index} className="flex items-center gap-6">
                  <div className="bg-white/10 p-2 rounded-full border border-white/20">
                    <img src={evoImg} className="h-20 w-20 object-contain" alt={`evolution-${index}`} />
                  </div>
                  {index < pokemon.evolutionImages.length - 1 && (
                    <span className="text-2xl font-bold text-white/50">→</span>
                  )}
                </div>
              ))
            ) : (
              <div className="text-xl italic capitalize text-white/60">
                {pokemon?.evolution || "---"}
              </div>
            )}
          </div>
        </section>

        <section className="bg-[#1a2b4b]/95 border border-white/20 p-6 rounded-md text-[13px] leading-relaxed shadow-lg">
          <p>
            <strong className="text-white">Location:</strong> 
            <span className="capitalize px-2">{pokemon?.location || "---"}</span>
            
          </p>
        </section>

      </main>
    </div>
  );
}