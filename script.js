const POKE_API_URL = "https://pokeapi.co/api/v2/pokemon" 
const speciesURl   = "https://pokeapi.co/api/v2/pokemon-species";
let detailsDataArray = []; 
let specArray = [];
let POKE_API_OFFSET = 0;
const POKE_API_LIMIT = 20;
const dialogRef = document.getElementById('cardDialog');
const eDialogRef = document.getElementById('errorDialog');
let pokemonText;
let load;
let evoChainArray =[];
let evoChainDataArray = [];
let dataArray = [];
let evoCache = [];
let evoImgFetch = "";
let imgOutput = "";
let varForFetch = "";



async function getPokemons(POKE_API_OFFSET){ 
    dataArray = [];
    let response;
        try{
            response = await fetch(POKE_API_URL + `?limit=${POKE_API_LIMIT}&offset=${POKE_API_OFFSET}`);
        } catch (error){
            console.log(error);
        }
    let responseAsJson = await response.json();
        for (index = 0; index < Object.keys(responseAsJson.results).length; index++) { 
                dataArray.push({
            url : responseAsJson.results[index].url
            })
        }
    fetchUrl(dataArray);
}


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
}


async function fetchSpecies(){  
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
 }

async function fetchForEvolutionStats(index){ 
    evoChainArray = [];
    let response;
        try{
            response = await fetch(specArray[index].speciesUrl);  
        }   catch(error){
            console.log(error);
        }
    let responseAsJson = await response.json();
        evoChainArray.push({
        evoKey : responseAsJson     
        })
    await fetchForEvoChainData(evoChainArray);
}


async function fetchForEvoChainData(evoChainArray){
    evoChainDataArray = [];
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


async function renderPokemons(detailsDataArray){ 
    let types;
    document.getElementById('pokemonList').innerHTML = "";
        for (let index = 0; index < detailsDataArray.length; index++) {
            types = renderTypes(index);
            document.getElementById('pokemonList').innerHTML += getTemplate(index, types);   
        }
}

function openDialog(index){
    dialogRef.showModal();
    renderDialogCard(index)
}

function openErrorDialog(pokemonText){
    eDialogRef.showModal();
    renderErrorDialog(pokemonText);
}

function renderErrorDialog(pokemonText){
    let errorContent = document.getElementById('errorContentBox');
        if(pokemonText.length <3){
            errorContent.innerHTML = `<h4>min. 3 letters please!</h4><button onclick="closeErrorDialog()">X</button>`
        } else{
            errorContent.innerHTML = `<h4 data-id="not-found">Search wasn't successful. Please try again.</h4><button onclick="closeErrorDialog()">X</button>`;
        }
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
        diaCont.innerHTML = getTemplate(index, renderTypes(index));
        btnDiv.innerHTML = renderDialogBtns(index);
        info.innerHTML = renderInfoTemplate(index);
        navigations.innerHTML = renderNaviBtns(index);
        renderInfo(index);
}

async function renderInfo(index){
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


async function renderEvoCard(index){
    const url = detailsDataArray[index].details.species.url;
    let urlCheck = evoCache.some(item =>  checkForUrl(item, url));
    if(!urlCheck == true){
        await fetchForEvolutionStats(index);
        evoCache.push(evoChainDataArray[0].chainKey.chain)
    }
    renderEvoCardContent(index);
}

function checkForUrl(item, url){
            if(item.species.url === url){
            return true
            }
            else if(item.evolves_to[0].species.url === url){
            return true
            } 
            else if(item.evolves_to[0].evolves_to[0].species.url === url){
            return true
            }
            return false
}

function renderEvoCardContent(index){
    let evo = document.getElementById('evoCard');
        document.getElementById('infoCard').style = "display: none";
        document.getElementById('progressCard').style = "display: none";
        document.getElementById('evoCard').style = "";
        evo.innerHTML = ``;
        let evolvesTo = evoChainDataArray[0].chainKey.chain;
        findPokemon(evo, evolvesTo, index);
}

async function findPokemon(evo, evolvesTo, index){
    let firstNameOfChain = evoChainDataArray[0].chainKey.chain.species.name;
    let specUrl = evoChainDataArray[0].chainKey.chain.species.url;
    let indexArrayForUrl =  specUrl.split("/");
    let indexForUrl = indexArrayForUrl[6];
        indexForUrl--;
        await checkForNewGenPokemon(index, firstNameOfChain, evolvesTo, evo, indexArrayForUrl, indexForUrl); 
    return
}


async function checkForNewGenPokemon(index, firstNameOfChain, evolvesTo, evo, indexArrayForUrl, indexForUrl){
    if(detailsDataArray[index].details.name != firstNameOfChain && evoChainDataArray[0].chainKey.chain.is_baby == true){
            varForFetch = await fetchNewGenPokemon(evolvesTo);
            evoImgFetch = await fetchToGetSprites(varForFetch);
            imgOutput = evoImgFetch.sprites.front_default;
            evo.innerHTML += getEvoTemplate(evolvesTo, imgOutput);
            evolvesTo = evolvesTo.evolves_to[0];
            specUrl = evoChainDataArray[0].chainKey.chain.evolves_to[0].species.url;
            indexArrayForUrl =  specUrl.split("/");
            indexForUrl = indexArrayForUrl[6];
            indexForUrl--;
        }
        await loopEvoTemplate(evolvesTo, imgOutput, indexForUrl, evo);
    return
}


async function loopEvoTemplate(evolvesTo, imgOutput, indexForUrl, evo){
    for (let indexLoop = 0; evolvesTo.evolves_to.length >= 0; indexLoop++){
                    imgOutput = detailsDataArray[indexForUrl].details.sprites.front_default;
                    evo.innerHTML += getEvoTemplate(evolvesTo, imgOutput);
        if (evolvesTo.evolves_to.length == 0){
                break; 
            }
            evolvesTo = evolvesTo.evolves_to[0];
            indexForUrl++;
        }
}


async function fetchNewGenPokemon(evolvesTo){
    try{
        response = await fetch(evolvesTo.species.url);    
    } catch (error){
        console.log(error);
    }
    let singleResponseAsJson = await response.json();

    return singleResponseAsJson.varieties[0].pokemon.url;
}

async function fetchToGetSprites(varForFetch){
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
    POKE_API_OFFSET+=20;
    fetchSpecies();
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
            clearInputAndDialog(pokemonText);
    } 
    document.getElementById('pokemonText').value = "";
}   

function loopForTemplate(domOutput){
    for(let index = 0; index < detailsDataArray.length; index++){
            if(detailsDataArray[index].details.name.includes(pokemonText)){
                domOutput = index;
                document.getElementById('pokemonList').innerHTML += getTemplate(index, renderTypes(index));
            } 
    }
    if(domOutput == ""){
        clearInputAndDialog(pokemonText);
        renderPokemons(detailsDataArray);
    }
}

function clearInputAndDialog(pokemonText){
    document.getElementById('pokemonText').value = "";
    openErrorDialog(pokemonText);
}

function init(){
    fetchSpecies();
    loaderFunction();
    getPokemons(POKE_API_OFFSET);
}

function loaderFunction(){
    load = setTimeout(showLoaderStart, 1000);
}

function showLoaderStart(){
    document.getElementById("loader").style.display = "none";
}

function showMoreLoader(){
    document.getElementById("loader").style.display = "flex";
    document.getElementById("loadBtn").style.display = "none";
     document.getElementById("pokemonList").style.pointerEvents = "none";
    document.getElementById("pokemonList").style.opacity = "0.33";
    load = setTimeout(loaderNone, 4000);
}

async function loaderNone(){
        document.getElementById("loadBtn").style.display ="flex";
        document.getElementById("loader").style.display = "none";
    await getPokemons(POKE_API_OFFSET);
        document.getElementById("pokemonList").style.pointerEvents = "";
        document.getElementById("pokemonList").style.opacity = "";
        document.getElementById("pokemonList").scrollIntoView({block: "nearest"});
}

function refreshSite(){
    document.getElementById('main_div').style.height = "auto";
    document.getElementById('slideButtons').style.display = "flex";
    renderPokemons(detailsDataArray);
}