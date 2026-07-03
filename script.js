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
    console.log(responseAsJson.results); //  console.log(responseAsJson.results[6].name) -> output "squirtle"
    return responseAsJson.results // returns the array of 40 Pokemons
}
async function renderPokemon(index){
let pokeResponse = await getPokemons();
let workArray = Object.keys(pokeResponse);
document.getElementById('pokemonlist').innerHTML = "";

    for (let index = 0; index < workArray.length; index++) {
        pokeArray.push(
            {
              name : pokeResponse[index].name
              // add the URL 
            }
        )
        document.getElementById('pokemonlist').innerHTML += getTemplate(index); // important to check the scopes!!
    }
}

function getTemplate(index){
    return `
    <div class="template_box">
        <h4>${pokeArray[index].name}</h4>
    </div>
`
}


function init(index){
getPokemons();
renderPokemon(index);
}

