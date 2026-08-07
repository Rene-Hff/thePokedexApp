const POKE_API_URL = "https://pokeapi.co/api/v2/pokemon" // get name and url
const speciesURl   = "https://pokeapi.co/api/v2/pokemon-species";
const dataArray = []; // pokemon urls
const detailsDataArray = []; // Main-Object keys and values
const specArray = []; // species urls
const evoChainArray =[]; // Objects to fetch for evo-chain
const evoChainDataArray = [];
const POKE_API_OFFSET = 0;
const POKE_API_LIMIT = 50;
const bulbasaurURL = "https://pokeapi.co/api/v2/pokemon/1/" // URL for bulbasaur
const dialogRef = document.getElementById('cardDialog');


async function getPokemons(){ //fetching the poke-api to get data and pushing the url in an array
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

async function fetchUrl(){ // fetching the dataArray to get the details of each pokemon
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
    fetchSpecies();
}

async function fetchSpecies(){
    let speciesData;
            try{
                response = await fetch(speciesURl + `?limit=${POKE_API_LIMIT}&0ffset=${POKE_API_OFFSET}`); 
            } catch(error) {
                console.log(error);
            }
        let responseAsJson = await response.json();
        let array = Object.keys(responseAsJson.results);
            for (let index = 0; index < array.length; index++) {
                specArray.push({
                    speciesUrl : responseAsJson.results[index].url
                })
            }
    console.log(specArray)
    fetchForEvolutionStats();
 }

async function fetchForEvolutionStats(){ // to get keys of the evo-chain
let response;
let loopArray = Object.keys(specArray);
    for (let index = 0; index < specArray.length; index++) {
        try{
            response = await fetch(specArray[index].speciesUrl); // response recived an Object with key-value pairs to fetch for the evolution chain 
        }   catch(error){
            console.log(error);
        }
    let responseAsJson = await response.json();
        evoChainArray.push({
        evoKey : responseAsJson     // evoKey = Object 
        })
    }
    console.log(evoChainArray); // evoChainArray includes  Objects from url fetch of species
    fetchForEvoChainData();
}

async function fetchForEvoChainData(){ // create array for evo-chain data, to execute on html
let response;
let loopArray = Object.keys(evoChainArray);
    for (let index = 0; index < evoChainArray.length; index++) {
            try{
                response = await fetch(evoChainArray[index].evoKey.evolution_chain.url);
            }   catch(error){
                console.log(error);
            }
    let responseAsJson = await response.json();
        evoChainDataArray.push({
        chainKey: responseAsJson
        })
    }
    console.log(evoChainDataArray);
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

async function renderPokemons(){ // looping through the dataArray to return the templates for each pokemon
    document.getElementById('pokemonList').innerHTML = "";
    let loopArray = Object.keys(dataArray);
        for (let index = 0; index < loopArray.length; index++) {
            document.getElementById('pokemonList').innerHTML += getTemplate(index);   
        }
}

function getTemplate(index, typeIndex){ // Template for Card with name, img and types 
    let types;
        types = renderTypes(index, typeIndex);
    return `
        <button type="button" class="template_box ${detailsDataArray[index].details.types[0].type.name}" onclick="openDialog(${index})"> 
            <h2>#${detailsDataArray[index].details.id} ${detailsDataArray[index].details.name.toUpperCase()}</h2>
            <img class="zoom img" src ="${detailsDataArray[index].details.sprites.front_default}"/>
            ${types} 
        </button>`
}

function openDialog(index){
    dialogRef.showModal();
    renderDialogCard(index)
}

function bubblingPrevention(event){
    event.stopPropagation();
}

function renderDialogCard(index){
    let diaCont = document.getElementById('dialogContentBox');
    let btnDiv = document.getElementById('buttonsDiv');
    let info = document.getElementById('infoCard');
        diaCont.innerHTML = getTemplate(index);
        btnDiv.innerHTML = renderDialogBtns(index);
        info.innerHTML = renderInfo(index);
}

function renderDialogBtns(index){
return `
    <button class="buttonStyles" onclick="renderInfo(${index})">Info</button>
    <button class="buttonStyles" onclick="renderProgress(${index})">Stats</button>
    <button class="buttonStyles" onclick="renderEvoCard(${index})">Evo</button>             
`
}

function renderInfo(index){
    let info = document.getElementById('infoCard');
    document.getElementById('progressCard').style = "display: none";
    document.getElementById('evoCard').style = "display: none";
    document.getElementById('infoCard').style = "";
    info.innerHTML = `
        <p>Weight: ${detailsDataArray[index].details.weight}</p>
        <p>Height: ${detailsDataArray[index].details.height}</p>
        <p>Base Experience: ${detailsDataArray[index].details.base_experience}</p>
        <p>Abilities: ${detailsDataArray[index].details.abilities[0].ability.name} & ${detailsDataArray[index].details.abilities[1].ability.name}</p>
    `
return info.innerHTML
}

function renderProgress(index){
    let progress = document.getElementById('progressCard');
    document.getElementById('infoCard').style = "display: none";
    document.getElementById('evoCard').style = "display: none";
    document.getElementById('progressCard').style = "";
    progress.innerHTML = `
        <div class="progressBarDiv">
            <span>${detailsDataArray[index].details.stats[0].stat.name}:</span>
            <div class="bar" style="height: 15px; width: ${detailsDataArray[index].details.stats[0].base_stat}%"></div>
        </div>
        <div class="progressBarDiv">
            <span>${detailsDataArray[index].details.stats[1].stat.name}:</span>
            <div class="bar" style="height: 15px; width: ${detailsDataArray[index].details.stats[1].base_stat}%"></div>
        </div>
        <div class="progressBarDiv">
            <span>${detailsDataArray[index].details.stats[2].stat.name}:</span>
            <div class="bar" style="height: 15px; width: ${detailsDataArray[index].details.stats[2].base_stat}%"></div>
        </div>
        <div class="progressBarDiv">
            <span>${detailsDataArray[index].details.stats[3].stat.name}:</span>
            <div class="bar" style="height: 15px; width: ${detailsDataArray[index].details.stats[3].base_stat}%"></div>
        </div>
    `
}

function renderTypes(index, typeIndex){
    let types = ""; // need to declare with  to prevent undefined
        for (let typeIndex = 0; typeIndex < detailsDataArray[index].details.types.length; typeIndex++) { 
            // typeIndex is the index of the inside Array of detailDataArray[].details.types[], to get the types of each Pokemon
                types += `<div class="type-name">${detailsDataArray[index].details.types[typeIndex].type.name}</div>`
            }
            return types
}

function renderEvoCard(index){
    let evo = document.getElementById('evoCard');
    document.getElementById('infoCard').style = "display: none";
    document.getElementById('progressCard').style = "display: none";
    document.getElementById('evoCard').style = "";
        let evolvesTo = evoChainDataArray[index].chainKey.chain;
            evo.innerHTML = ``;
        while(evolvesTo.evolves_to.length >= 0){ 
              evo.innerHTML += `
            <div class="evoChainDiv">
                <figure class="evoChainNamesandImgs">
                    <img   src ="${detailsDataArray[index].details.sprites.front_default}"/>
                    <figcaption>${evolvesTo.species.name.toUpperCase()} >> </figcaption> 
                </figure>`  
        evolvesTo = evolvesTo.evolves_to[0];     
        } 
}
function closeDialog(){
    dialogRef.close();
}

function init(index){
    getPokemons();
    getSinglePokemon();
}
