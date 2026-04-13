import axios from 'axios';
import React, { useEffect, useState } from 'react'
import "./styles.css";
import A from "../assets/loading-icon.png";
import B from "../assets/home-icon.png";


export const Home = () => {
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonData, setPokemonData] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Pokemon";
  }, []
  );


  async function getData() {

    if (pokemonName.trim() === "") {
      setLoading(true);
      setError("Enter a pokemon's name");
      setPokemonData("")
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      setLoading(true);
      setError("");       // clear previous error
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`)
      setPokemonData(
        {
          name: response.data.name,
          img: response.data.sprites.front_default,
          type: response.data.types[0].type.name,
          hp: response.data.stats.find(stat => stat.stat.name === "hp").base_stat
        }
      );
      // Force loading for 3 seconds
      setTimeout(() => {
        setLoading(false);
      }, 1000);

    } catch (err) {
      console.error("This pokemon does not exist:", err);
      // clear if pokemon does not exist
      setPokemonData("")
      setError("Pokemon not found!");
      // Still show loading for 3 seconds before hiding
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }

  };

  return (
    <div className='mainDiv'>

      <div className='detailsDiv'>
        <h1>Fetch A Pokemon!</h1>
        <input
          placeholder="Enter pokemon name:"
          value={pokemonName}
          onChange={(e) => setPokemonName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              getData();
            }
          }}
        />

        {/* <button onClick={getData}> Fetch Pokemon </button> */}
        <br />

        <div className='pokemonCard'>
          {!loading && !error && !pokemonData && <img src={B} alt="Loading..." className='homeIcon' />}
          {loading && <img src={A} alt="Loading..." className='loadingIcon' />}
          {!loading && error && <p className='errorMsg'>{error}</p>}

          {!loading && !error && pokemonData.img && <img src={pokemonData.img} alt="Pokemon Img" id="pokemonImg" />}
          {!loading && !error && pokemonData.name && <h3 style={{ textTransform: 'capitalize' }}>{pokemonData.name}</h3>}
          <div className='pokemonCardDetails'>
            {!loading && !error && pokemonData.type && <p>Type: <b>{pokemonData.type.toUpperCase()}</b></p>}
            {!loading && !error && pokemonData.hp && <p>HP: <b>{pokemonData.hp}</b></p>}
          </div>
        </div>

      </div>

    </div>
  )
}



// fetch("https://pokeapi.co/api/v2/pokemon/charmander")
//     .then(response => response.json())
//     .then(data => console.log(data))
//     .catch(error => console.error(error));