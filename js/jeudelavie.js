/**
 * Initialisation des variables
*/
let iterationsOutput = document.getElementById("iterations"),
    aliveCellsOutput = document.getElementById("alive"),
    cellSize = 20,
    gridWidth,
    gridHeight;

let c = document.getElementById('grille'),
    ctx = c.getContext('2d'),
    canvas = document.getElementsByTagName('canvas');

let parentContainer = document.getElementById("data-container"),
    formsList;
let file = "formes/formes.xml";

let lifeRules, deathRules,
delay = 1000,
gridMode = false; // on n'a pas murs infinis


/**
 * Remplissage aleatoire de la grille
*/
function randomFill(gridWidth, gridHeight, fillingRate){
    let generation = new Array(Math.floor(gridHeight / cellSize));
    let e = parseInt(fillingRate)/100;
    let nb = 0;
    let nbMax = Math.floor(e * (gridHeight / cellSize) * (gridWidth / cellSize));
    for (let x = 0; x < Math.floor(gridHeight / cellSize); x++) {
        generation[x] = [];
        for (let y = 0; y < Math.floor(gridWidth / cellSize); y++) {  
            if (Math.random() <= e && nb <= nbMax){ 
                generation[x][y] =  1;   
                nb++;
            }
            else  generation[x][y] = 0;
        }  
    }
    //Initialisation du nb d'iterations et du nombre de cellules vivantes
    nbIterations = 0;
    nbAliveCells = nb;
   // Affichage du nb de cellules vivantes et du nb d'iterations
    document.getElementById("iterations").innerHTML = nbIterations;
    document.getElementById("alive").innerHTML = nbAliveCells;
    return generation;
}

/**
 * dessin de la grille avec les cellules
*/
 function drawGrid(context2D,generation){
    let height = generation.length;
    let width = generation[0].length;
    c.width = width * cellSize; // in pixels
    c.height = height * cellSize; // in pixels
    //context2D.beginPath();
    clearGrid(context2D, canvas.width, canvas.height);
    context2D.lineWidth = "0.2";
    context2D.fillStyle = 'white';
    for(let x = 0; x < height; x++) {
        for(let y = 0; y < width; y++) {
                context2D.strokeRect(y * cellSize, x * cellSize, cellSize, cellSize);
        }
    }
}

/**
 * dessin de la grille avec les cellules
*/
function drawCells(context2D,generation){
    let height = generation.length;
    let width = generation[0].length;
    //drawCells
    context2D.beginPath();
    for(let x = 0; x < height; x++) {
        for(let y = 0; y < width; y++) {
            if(generation[x][y] === 1) {
                //context2D.fillRect(x, y, 1, 1);
                context2D.fillStyle = 'black'; 
                context2D.rect(y * cellSize, x * cellSize, cellSize, cellSize); 
                context2D.stroke();
                context2D.fill();
            }
        }
    }
}

/**
 * Récupère le contenu d'un fichier XML présent de façon asynchrone et exécute la fonction
 * donnée en paramètre en donnant le contenu du fichier.
 * 
 * Attention : cette méthode ne fonctionne que sur un serveur web pour des raisons de sécurité des navigateurs.
 * 
 * @param {string} file - nom du fichier XML à ouvrir (ici un fichier sur le serveur web local)
 * @param {Function} loadXMLDatas - fonction exécutée lorsque le contenu du fichier a été récupéré
 */
 function loadXML(file,callback){
    var xttp = new XMLHttpRequest();
    xttp.onload = callback;
    xttp.open('GET', file, true);
    //xhr.timeout = 2000;    
    xttp.send(null);
}

/**
 * Fonction qui récupère un tableau de toutes les formes spécifiques du jeu de la vie 
 * à partir du fichier formes.xml
 */
 function loadForms(){
    if(formsList === undefined){
        loadXML(file, function () {
            const xmlDoc = this.responseXML;
            formsList = Array.from(xmlDoc.getElementsByTagName("forme"));
            fillFormsList();
        });
    }
}

/*
* On récupère les noms des differentes formes
* on cree le select
* on cree les options a partir des noms recuperes
* on les affiche dans le html
* 
 */
function fillFormsList(){
    let f = document.getElementById('specific_forms');
    let nameFromXML = [];
    //let imageformXML = [];
    // Ajout du select
    let newSelect = document.createElement('select');
    newSelect.setAttribute('id','selectForm');
    newSelect.setAttribute('onchange','modelFill(this)');
    f.appendChild(newSelect);
    // Extraction de la liste des noms des formes
    for(const forme of formsList){
        for (let i = 0; i < formsList.length; i++) {
            nameFromXML[i] = formsList[i].getElementsByTagName("name")[0].childNodes[0].nodeValue;
            //imageformXML[i] = formsList[i].getElementsByTagName("image")[0].childNodes[0].nodeValue;
        }       
    }
    // Ajout des options au select
    while (nameFromXML.length){
        let choixFormes = nameFromXML.pop();
        //let choixImages = imageformXML.pop();
        let option = document.createElement("option");
        option.value = choixFormes;
        //option.setAttribute('style','background:url('+choixImages+') no-repeat; width:50px; height:50px;');
        option.innerHTML = choixFormes;
        newSelect.appendChild(option);
    }    
}

/**
 * Récupération des valeurs de la grille
 * @param {object} forme - La balise XML contenant toutes les informations sur la forme à afficher (pattern, nom, ..)
 * Tracé de la grille
 * placement des bacteries
 * @param {number} x - Coordonnée x
 * @param {number} y - Coordonnée y
 * */
function modelFill(name){ 
    let pattern, patternLines;
    let nb = 0;
    /*On recupere la forme dans le tableau */
    let nameValue = document.getElementById("selectForm").value;
    clearGrid(ctx, 100, 100)
    /*On recupere la forme dans le fichier */
    forme = formsList.find(forme => forme.getElementsByTagName("name")[0].innerHTML == nameValue);
    width = parseInt(forme.getElementsByTagName("width")[0].innerHTML);
    height = parseInt(forme.getElementsByTagName("height")[0].innerHTML);
    pattern = forme.getElementsByTagName("pattern")[0].innerHTML;
    patternLines = pattern.split("\\n");
    /*Taille de la grille*/  
    new_width = cellSize * width;
    new_height = cellSize * height;  
    //gridWidth = Math.floor(new_width / cellSize);
    //gridHeight = Math.floor(new_height / cellSize);
    /*Création du tableau des bacrteries vide*/
    let generationModel = new Array(height);
    for (let x = 0; x < height; x++) {
        generationModel[x] = [];
        for (let y = 0; y < width; y++) {    
            generationModel[x][y] =  0;
        }    
    }
    /*Placement des bacteries*/
    x = 0;
    y = 0;
    for (let element of patternLines) {
        for(let c of element){
            s = parseInt(c);            
            console.log('s',s)       
            if (s == 1){
                generationModel[x][y] = 1;
                nb++;
            }
            y++;
            if (y >= width)
            {
                y = 0;
                x++;
                if(x >= height) break;
            }
        }
    }       
   //Initialisation du nb d'iterations et du nombre de cellules vivantes
   nbIterations = 0;
   nbAliveCells = nb;
  // Affichage du nb de cellules vivantes et du nb d'iterations
   document.getElementById("iterations").innerHTML = nbIterations;
   document.getElementById("alive").innerHTML = nbAliveCells;
   drawGrid(ctx,generationModel);
   drawCells(ctx,generationModel);
}

/**
 * Efface le contenu de la grille
 */
 function clearGrid(context2D, width, height){
    if(gridMode) gridMode = false;
    nbIterations = 0;
    nbAliveCells = 0;
    cellsParIteration = [];
    context2D.fillStyle = 'black';
    context2D.fillRect(0, 0, width, height);
    context2D.clearRect(0, 0, width * cellSize, height * cellSize);    
    document.getElementById("iterations").innerHTML = '';
    document.getElementById("alive").innerHTML = '';
}

(function() {
    //createDefaultGrid
    let generation = randomFill(100, 100, 30);
    drawGrid(ctx, generation);
    drawCells(ctx, generation);
    //telechargement du fichier contenant les modeles
    loadForms();
})()