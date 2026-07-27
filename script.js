const POKE_API_URL = "https://pokeapi.co/api/v2/pokemon" // get name and url
const dataArray = []; // only url 
const detailsDataArray = []; // Object keys and values
const POKE_API_OFFSET = 0;
const POKE_API_LIMIT = 50;
const bulbasaurURL = "https://pokeapi.co/api/v2/pokemon/1/" // URL for bulbasaur
const typeURL =  "https://pokeapi.co/api/v2/type" // URL for all types of pokemon
const dialogRef = document.getElementById('cardDialog');





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
document.getElementById('pokemonList').innerHTML = "";
let loopArray = Object.keys(dataArray);
    for (let index = 0; index < loopArray.length; index++) {
        document.getElementById('pokemonList').innerHTML += getTemplate(index);   
    }
}


function getTemplate(index, typeIndex){ 
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
    <button class="buttonStyles">Evo</button>             
`
}
function renderInfo(index){
let info = document.getElementById('infoCard');
document.getElementById('progressCard').style = "display: none";
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
    document.getElementById('progressCard').style = "";
    progress.innerHTML = `
    <div class="progressBarDiv">
        <div class="bar" style="height: 15px; width: 60%"></div>
    </div>
    <div class="progressBarDiv">
        <div class="bar" style="height: 15px; width: 40%"></div>
    </div>
    <div class="progressBarDiv">
        <div class="bar" style="height: 15px; width: 20%"></div>
    </div>
    <div class="progressBarDiv">
        <div class="bar" style="height: 15px; width: 20%"></div>
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
function closeDialog(){
dialogRef.close();
}
function init(index){
getPokemons();
getSinglePokemon();
}

