const POKE_API_URL = "https://pokeapi.co/api/v2/pokemon?limit=40&offset=0"
const pokeArray = [];
async function getPokemons(){
    let response = await fetch(POKE_API_URL);
    try{
        response = await fetch(POKE_API_URL);
    } catch (error){
    console.log(error);
    }
    let responseAsJson = await response.json();
    console.log(responseAsJson.results[6].name); //  console.log(responseAsJson.results[6].name) -> output "squirtle"
    const pokemonList = document.getElementById("pokemonlist").innerHTML = `<h1>${responseAsJson.results[6].name}</h1>`;
    return responseAsJson.results // returns the array of 40 Pokemons
}

function init(){
getPokemons();
}

