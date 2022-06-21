/**
 * Initialisation des variables
*/
let iterationsOutput = document.getElementById("iterations"),
    aliveCellsOutput = document.getElementById("alive"),
    cellSize = 20,
    gridWidth,
    gridHeight;

let c = document.getElementById('grille'),
    ctx = c.getContext('2d');

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
    context2D.beginPath();
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
    context2D.lineWidth = "0.2";
    context2D.fillStyle = 'white';
    for(let x = 0; x < height; x++) {
        console.log('xfill',x)
        for(let y = 0; y < width; y++) {
            console.log('yfill',y)
            console.log('generation[x][y]',generation[x][y])
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
 * Efface le contenu de la grille
 */
 function clearGrid(context2D, width, height){
    if(isActive) isActive = false;
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
})()