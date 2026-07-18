const POKE_API_URL = "https://pokeapi.co/api/v2/pokemon" // get name and url
const dataArray = []; // only url 
const detailsDataArray = []; // Object keys and values
const typesArray = [];
const POKE_API_OFFSET = 0;
const POKE_API_LIMIT = 50;
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
            }   catch(error){
                console.log(error);
            }
        let responseAsJson = await response.json();
                detailsDataArray.push({
                details : responseAsJson
        })
   }
    renderPokemons();
    //fetchTypesUrl();
    console.log(detailsDataArray);
}

/*async function fetchTypesUrl(){
let response;
let loopArray = Object.keys(dataArray);
        for(let index = 0; index < dataArray.length; index++){
            try{
                response = await fetch(detailsDataArray[index].details.types[index].type.url);
            }   catch(error){
                console.log(error);
            }
            let responseAsJson = await response.json();
                typesArray.push({
                types : responseAsJson
        })
        }
}
*/
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
        <h4>#${detailsDataArray[index].details.id} ${detailsDataArray[index].details.name.toUpperCase()}</h4>
        <img class="zoom img" src ="${detailsDataArray[index].details.sprites.front_default}"
        <p>${detailsDataArray[index].details.types[0].type.name}</p>
    </div>`
}


function init(index){
getPokemons();
getSinglePokemon();
}

