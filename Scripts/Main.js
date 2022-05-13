let gameState = null;
let isGameOver = false;
let childrenArray = null;

document.addEventListener("DOMContentLoaded", function(event) {

  startNewGame();
});

//starts new game
function startNewGame (){

  let gridSize_x = 10;
  let gridSize_y = 10;
  let mineCount = 20;

  gameState = generatedGameState(gridSize_x, gridSize_y, mineCount);

  bindUI(gameState);
}

function generatedGameState(gridSize_x, gridSize_y, mineCount) {

    let gameState = new Array(gridSize_x * gridSize_y);

    let generetedMineCount = 0;

    while (generetedMineCount < mineCount) {

      let pendingMineIndex = Math.floor(Math.random()*gameState.length);


      if (gameState[pendingMineIndex] != true)
        {
          gameState[pendingMineIndex] = true;
          generetedMineCount++;
        };
  };

  return gameState;
};

function bindUI(gameState) {

  let gridDom = document.querySelector(".Grid");
  gridDom.innerHTML = null;

  for (let i = 0; i < gameState.length; i++) {

    let fieldDom = document.createElement("div");
    fieldDom.classList.add("Field");

    gridDom.appendChild(fieldDom);

    if (gameState[i] == true) {
      // starting game, with visible mines. not needed
      fieldDom.innerHTML = "*";
    }

    fieldDom.addEventListener("click", gridCell_onClick);
  }
}

function checkForEndGame(cellIndex) {

  //returns 0: for defeat, 1: win, 2: still in progress

  // still in progress by default
  let result = 2;
  let mineClicked = gameState[cellIndex];

  // end game
  if (mineClicked) result  = 0;

  // win
  if (mineClicked) result = 1;

  return result;
}

function checkIfIndexIsValidCell (pendingIndex, rowIndex) {

  let indexIsValid = false;

  let isValidRowIndex = Math.floor(pendingIndex / 10) == rowIndex;

  if (isValidRowIndex && pendingIndex >= 0 && pendingIndex < gameState.length) {
    indexIsValid = true;
   }

   return indexIsValid;
}

function checkIfCellIsMine (pendingIndex, rowIndex) {

    let isValidCell = checkIfIndexIsValidCell(pendingIndex, rowIndex);

    let isMine =  isValidCell && gameState[pendingIndex];

    return isMine;
 }

 function clickNeighbourCell(cellIndex, rowIndex) {

  let isInsideGrid = checkIfIndexIsValidCell(cellIndex, rowIndex)

  if (isInsideGrid) {

    // avoiding infitive loop, by targeting already selected 0
    let targetCellDom = childrenArray[cellIndex];

    let isEmpty = targetCellDom.classList.contains("Empty");

    if (!isEmpty) targetCellDom.click()
  }
}

function gridCell_onClick(e){

  if (isGameOver) return;

  let targetCellDom = e.target;
  childrenArray = Array.from(targetCellDom.parentNode.children);
  let cellIndex = childrenArray.indexOf(targetCellDom);
  let gameProgressState = checkForEndGame(cellIndex);

  targetCellDom.classList.add("Selected");

  //game over - player lost
  if (gameProgressState == 0) {

    //game over!
    let gridDom = document.querySelector(".Grid");

    targetCellDom.classList.add("Mine");

    isGameOver = true;
    // confirm("Do you want to play a new game?")
    // autoamtically switches to a new screen, not needed!
    //gridDom.innerHTML = "Game Over";
    //todo: refacture
    alert("You're dead!")
  }
  //game over - player won
  else if (gameProgressState == 1) {
    //document.querySelector(".Question1").style.display = "block";
  }
  //game is still in progress
  else if (gameProgressState == 2) {

     let leftCellIndex = cellIndex - 1;
     let rightCellIndex = cellIndex + 1;
     let topCellIndex = cellIndex - 10;
     let bottomCellIndex = cellIndex + 10;
     let topLeftCellIndex = cellIndex - 10 - 1;
     let topRightCellIndex = cellIndex - 10 + 1;
     let bottomLeftCellIndex = cellIndex + 10 - 1;
     let bottomRightCellIndex = cellIndex + 10 + 1;

     let rowIndex = Math.floor(cellIndex / 10);
     let minesAround = 0;

     if (checkIfCellIsMine(leftCellIndex, rowIndex)) minesAround++;
     if (checkIfCellIsMine(rightCellIndex, rowIndex)) minesAround++;
     if (checkIfCellIsMine(topCellIndex, rowIndex - 1)) minesAround++;
     if (checkIfCellIsMine(bottomCellIndex, rowIndex + 1)) minesAround++;
     if (checkIfCellIsMine(topLeftCellIndex, rowIndex - 1)) minesAround++;
     if (checkIfCellIsMine(topRightCellIndex, rowIndex - 1)) minesAround++;
     if (checkIfCellIsMine(bottomLeftCellIndex, rowIndex + 1)) minesAround++;
     if (checkIfCellIsMine(bottomRightCellIndex, rowIndex + 1)) minesAround++;

     targetCellDom.innerHTML = minesAround;

     if (minesAround === 0) {

      // doesn´t display 0
      targetCellDom.innerHTML = "";

      targetCellDom.classList.add("Empty")

       clickNeighbourCell(leftCellIndex, rowIndex);
       clickNeighbourCell(rightCellIndex, rowIndex);
       clickNeighbourCell(topCellIndex, rowIndex - 1);
       clickNeighbourCell(bottomCellIndex, rowIndex + 1);
       clickNeighbourCell(topLeftCellIndex, rowIndex - 1);
      clickNeighbourCell(topRightCellIndex, rowIndex - 1);
       clickNeighbourCell(bottomLeftCellIndex, rowIndex + 1);
       clickNeighbourCell(bottomRightCellIndex, rowIndex + 1);
     }
  }
}
