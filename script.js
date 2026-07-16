const POKE_API_URL = "https://pokeapi.co/api/v2/pokemon" // get name and url
const dataArray = [];
const detailsDataArray = []; 
const POKE_API_OFFSET = 0;
const POKE_API_LIMIT = 40;
const bulbasaurURL = "https://pokeapi.co/api/v2/pokemon/1/" // URL for bulbasaur





async function getPokemons(){ 
    let response;
        try{
            response = await fetch(POKE_API_URL + `?limit=${POKE_API_LIMIT}&0ffset=${POKE_API_OFFSET}`);
        } catch (error){
            console.log(error);
        }
    let responseAsJson = await response.json();
    let array = Object.keys(responseAsJson.results);
        for (let index = 0; index < array.length; index++) { // push the url keys into the global array named dataArray
            dataArray.push(
                {
                    url : responseAsJson.results[index].url
                })
        }
    fetchUrl();
    console.log(dataArray);
}
async function fetchUrl(){
let response;
let loopArray = Object.keys(dataArray);
        for (let index = 0; index < dataArray.length; index++) {        
            try{
                response = await fetch(dataArray[index].url);
            } catch(error){
                console.log(error);
            }
        let responseAsJson = await response.json();
        detailsDataArray.push({
                details : responseAsJson
        })
   }
    renderPokemons();
    console.log(detailsDataArray);
}

// fetch for a single pokemon to get its atributes
async function getSinglePokemon(){ 
    let singleResponse = await fetch(bulbasaurURL);
    try{
        response = await fetch(bulbasaurURL);    
    } catch (error){
    console.log(error);
    }
    let singleResponseAsJson = await response.json();
    console.log(singleResponseAsJson); // with .moves you get the moves object and its keys and values 
    return singleResponseAsJson;
}


async function renderPokemons(){
document.getElementById('pokemonlist').innerHTML = "";
let loopArray = Object.keys(dataArray);
    for (let index = 0; index < loopArray.length; index++) {
        document.getElementById('pokemonlist').innerHTML += getTemplate(index);   
    }
}


function getTemplate(index){
    return `
    <div class="template_box">
        <h3>#${detailsDataArray[index].details.id} | ${detailsDataArray[index].details.name}</h3>
    </div>`
}


function init(index){
getPokemons();
getSinglePokemon();
renderPokemons();
}

