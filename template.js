// Template for Card with name, img and types + lazy loading added
function getTemplate(index){ 
    let types;
        types = renderTypes(index);
    return `
        <button data-id="card" type="button" class="template_box ${detailsDataArray[index].details.types[0].type.name}" onclick="openDialog(${index})"> 
            <h2>#${detailsDataArray[index].details.id} ${detailsDataArray[index].details.name.toUpperCase()}</h2>
                <img data-id="card-image" loading="lazy" class="zoom img" src ="${detailsDataArray[index].details.sprites.front_default}"/> 
                <img id="dialog-image" src ="./img/pokeLogo.png">
            ${types} 
        </button>`
}

function renderDialogBtns(index){
    return `
        <button class="buttonStyles" onclick="renderInfo(${index})">Info</button>
        <button class="buttonStyles" onclick="renderProgress(${index})">Stats</button>
        <button class="buttonStyles" onclick="renderEvoCard(${index})">Evo</button>             
    `
}

function renderInfoTemplate(index){
    return `   
        <p>Weight: ${detailsDataArray[index].details.weight}</p>
        <p>Height: ${detailsDataArray[index].details.height}</p>
        <p>Base Experience: ${detailsDataArray[index].details.base_experience}</p>
        <p>Abilities: ${detailsDataArray[index].details.abilities[0].ability.name}</p> 
    ` 
}

function renderProgressTemplate(index){
    return `
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

function renderNaviBtns(index){
    return `
            <button data-id="prev-button" id="leftBtn" onclick="slideImg('left', ${index})"> < </button>
            <button data-id="close-dialog" id="closeDialogBtn" onclick="closeDialog('${index}')"> X </button>
            <button data-id="next-button" id="rightBtn" onclick="slideImg('right', ${index})"> > </button>     
    `
}

function getEvoTemplate(evolvesTo, imgOutput){
    return `
            <div class="evoChainDiv">
                <figure class="evoChainNamesandImgs">
                    <img   src ="${imgOutput}"/>
                        <figcaption>${evolvesTo.species.name.toUpperCase()} <br> >> </br> </figcaption> 
                </figure>
            </div>
    `
}

function renderErrorDialog(){
    let errorContent = document.getElementById('errorContentBox');
        errorContent.innerHTML = `<h4 data-id="not-found">Search wasn't successful. Please try again.</h4><button onclick="closeErrorDialog()">X</button>`;
}