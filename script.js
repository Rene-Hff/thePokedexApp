const POKE_API_URL = "https://pokeapi.co/api/v2/pokemon" 
const speciesURl   = "https://pokeapi.co/api/v2/pokemon-species";
const detailsDataArray = []; 
const evoChainDataArray = [];
let POKE_API_OFFSET = 0;
const POKE_API_LIMIT = 30;
const dialogRef = document.getElementById('cardDialog');
const eDialogRef = document.getElementById('errorDialog');
let pokemonText;
let load;

//fetching the poke-api to get data and pushing the url in an array
async function getPokemons(POKE_API_OFFSET){ 
    let response;
    let dataArray = [];
        try{
            response = await fetch(POKE_API_URL + `?limit=${POKE_API_LIMIT}&offset=${POKE_API_OFFSET}`);
        } catch (error){
            console.log(error);
        }
    let responseAsJson = await response.json();
        for (index = 0; index < Object.keys(responseAsJson.results).length; index++) { // push the url keys into the global array named dataArray
                dataArray.push(
                {
                    url : responseAsJson.results[index].url
                })
        }
    fetchUrl(dataArray);
}

// fetching the dataArray to get the details of each pokemon
async function fetchUrl(dataArray){ 
    let response;
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
    renderPokemons(detailsDataArray);
    fetchSpecies();
}

async function fetchSpecies(){
    let specArray = []; 
    let speciesData;
            try{
                response = await fetch(speciesURl + `?limit=${POKE_API_LIMIT}&offset=${POKE_API_OFFSET}`); 
            } catch(error) {
                console.log(error);
            }
        let responseAsJson = await response.json();
            for (let index = 0; index < responseAsJson.results.length; index++) {
                specArray.push({
                    speciesUrl : responseAsJson.results[index].url
                })
            }
    fetchForEvolutionStats(specArray);
 }
// get keys of the evo-chain
async function fetchForEvolutionStats(specArray){ 
let response;
const evoChainArray =[]; 
    for (let index = 0; index < specArray.length; index++) {
        try{
            response = await fetch(specArray[index].speciesUrl);  
        }   catch(error){
            console.log(error);
        }
    let responseAsJson = await response.json();
        evoChainArray.push({
        evoKey : responseAsJson     
        })
    }
    fetchForEvoChainData(evoChainArray);
}

// create array for evo-chain data, to execute on html
async function fetchForEvoChainData(evoChainArray){ 
let response;
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
}

// looping through the dataArray to return the templates for each pokemon
async function renderPokemons(detailsDataArray){ 
    document.getElementById('pokemonList').innerHTML = "";
        for (let index = 0; index < detailsDataArray.length; index++) {
            document.getElementById('pokemonList').innerHTML += getTemplate(index);   
        }
}

function openDialog(index){
    dialogRef.showModal();
    renderDialogCard(index)
}
function openErrorDialog(){
    eDialogRef.showModal();
    renderErrorDialog();
}

function closeErrorDialog(){
eDialogRef.close();
}

function bubblingPrevention(event){
    event.stopPropagation();
}

function renderDialogCard(index){
    let diaCont = document.getElementById('dialogContentBox');
    let btnDiv = document.getElementById('buttonsDiv');
    let info = document.getElementById('infoCard');
    let navigations = document.getElementById('slideButtons');
        diaCont.innerHTML = getTemplate(index);
        btnDiv.innerHTML = renderDialogBtns(index);
        info.innerHTML = renderInfoTemplate(index);
        navigations.innerHTML = renderNaviBtns(index);
        renderEvoCard(index);
        renderInfoTemplate(index);
        renderProgress(index);
}

function renderInfo(index){
    let info = document.getElementById('infoCard');
        document.getElementById('progressCard').style = "display: none";
        document.getElementById('evoCard').style = "display: none";
        document.getElementById('infoCard').style = "";
        info.innerHTML = renderInfoTemplate(index);  
}

function renderProgress(index){
    let progress = document.getElementById('progressCard');
        document.getElementById('infoCard').style = "display: none";
        document.getElementById('evoCard').style = "display: none";
        document.getElementById('progressCard').style = "";
        progress.innerHTML = renderProgressTemplate(index);
}

function renderTypes(index){
    let types = ""; 
        for (let typeIndex = 0; typeIndex < detailsDataArray[index].details.types.length; typeIndex++) { 
                types += `<div class="type-name">${detailsDataArray[index].details.types[typeIndex].type.name}</div>`
            }
            return types
}

function renderEvoCard(index){
    let evo = document.getElementById('evoCard');
    document.getElementById('infoCard').style = "display: none";
    document.getElementById('progressCard').style = "display: none";
    document.getElementById('evoCard').style = "";
    evo.innerHTML = ``;
    let evolvesTo = evoChainDataArray[index].chainKey.chain;
    findPokemon(evo, evolvesTo);
}

async function findPokemon(evo, evolvesTo){
    let evoImgFetch = "";
    let varForFetch;
    let imgOutput ="";
    for ( let indexLoop = 0; evolvesTo.evolves_to.length >= 0; indexLoop++){  
        varForFetch = await fetchNewGenPokemon(evolvesTo);          
        evoImgFetch =  await fetchToGetSprites(varForFetch);
        imgOutput = evoImgFetch.sprites.front_default;
        evo.innerHTML += getEvoTemplate(evolvesTo, imgOutput);
        if (evolvesTo.evolves_to.length == 0){
                break; 
            }
        evolvesTo = evolvesTo.evolves_to[0];
    } 
    return
}

async function fetchNewGenPokemon(evolvesTo){
    let singleResponse = await fetch(evolvesTo.species.url);
    try{
        response = await fetch(evolvesTo.species.url);    
    } catch (error){
    console.log(error);
    }
    let singleResponseAsJson = await response.json();

    return singleResponseAsJson.varieties[0].pokemon.url;
}

async function fetchToGetSprites(varForFetch){
    let singleResponse = await fetch(varForFetch);
        try{
          response = await fetch(varForFetch);
        } catch (error){
        console.log(error);
        }
    let singleResponseAsJson = await response.json();
    return singleResponseAsJson;
}

function slideImg(direction, index){
if (direction == 'left') {
    decreaseIndex(index);
} else if (direction == 'right') {
    increaseIndex(index);
}
}

function increaseIndex(index){
index++;
if(index == detailsDataArray.length){
    index = 0;
}
renderDialogCard(index);
}

function decreaseIndex(index){
index--;
if(index < 0){
    index = detailsDataArray.length-1;
}
renderDialogCard(index);
}

function closeDialog(){
    dialogRef.close();
}

async function loadMore(){
    POKE_API_OFFSET+=30;
    showMoreLoader(); 
}

function showInput(){
let domOutput = "";
    pokemonText = document.getElementById('pokemonText').value;
    if(pokemonText.length >= 3){
        document.getElementById('pokemonList').innerHTML = "";
        pokemonText = document.getElementById('pokemonText').value.toLocaleLowerCase();
        loopForTemplate(domOutput);
    } else{ 
            clearInputAndDialog();
    } 
    document.getElementById('pokemonText').value = "";
}   

function loopForTemplate(domOutput){
for(let index = 0; index < detailsDataArray.length; index++){
        if(detailsDataArray[index].details.name.includes(pokemonText)){
            domOutput = index;
            document.getElementById('main_div').style.height = "100vh";
            document.getElementById('pokemonList').innerHTML += getTemplate(index);
        } 
    }
    if(domOutput == ""){
        clearInputAndDialog();
        renderPokemons(detailsDataArray);
    }
}

function clearInputAndDialog(){
    document.getElementById('pokemonText').value = "";
    openErrorDialog();
}

function init(){
    loaderFunction();
    getPokemons(POKE_API_OFFSET);
}

function loaderFunction(){
    load = setTimeout(showLoaderStart, 1500);
}

function showLoaderStart(){
    document.getElementById("loader").style.display = "none";
    document.getElementById("pokemonList").style.display = "flex";
}

function showMoreLoader(){
    document.getElementById("pokemonList").style.pointerEvents = "none";
    document.getElementById("loader").style.display = "flex";
    document.getElementById("loadBtn").style.display = "none";
    load = setTimeout(loaderNone, 2500);
}

async function loaderNone(){
    document.getElementById("loader").style.display = "none";
    document.getElementById("pokemonList").style.display = "flex";
    document.getElementById("loadBtn").style.display ="flex";
    await getPokemons(POKE_API_OFFSET);
    document.getElementById("pokemonList").style.pointerEvents = "";
}

function refreshSite(){
    document.getElementById('main_div').style.height = "auto";
    renderPokemons(detailsDataArray);

}