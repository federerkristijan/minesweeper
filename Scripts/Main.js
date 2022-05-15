let gameState = null;
let isGameOver = false;
let childrenArray = null;
let gameProgressState = null;
let gameProgressEnum = {"defeat": 0, "win": 1, "stillInProgress": 2};
let correctCellCount = null;
let mineCount = null;
let gridSize_x = null;
let gridSize_y = null;

document.addEventListener("DOMContentLoaded", function(event) {

  startNewGame();
});

function getSettingsFromUI() {

  //todo: let user provide grid data
  // iskreno, znam kako u backend napraviti to...cekaj, input kroz html?
  //da; imat ces nekaj u stilu <input type="text" id="gridSizeX" /> ok, budme se sam s time igrao. hvala ti puno!!!aj, drs se onda. mere i ti isto!
  function gridDataFromUser () {
    
  };
};

//starts new game
function startNewGame () {

  gridSize_x = 10;
  gridSize_y = 10;
  mineCount = 20;

  gameState = generatedGameState(gridSize_x, gridSize_y, mineCount);

  bindUI(gameState);
}

function generatedGameState(gridSize_x, gridSize_y, mineCount) {

    let gameState = new Array(gridSize_x * gridSize_y);

    let generetedMineCount = 0;
    correctCellCount = 0;

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
      // fieldDom.innerHTML = "*";
    }

    fieldDom.addEventListener("click", gridCell_onClick);
  }
}

function checkForEndGame(cellIndex) {

  //returns 0: for defeat, 1: win, 2: still in progress

  // still in progress by default
  let result = gameProgressEnum.stillInProgress;

  let mineClicked = gameState[cellIndex];

  // end game
  if (mineClicked) result = gameProgressEnum.defeat;

  // win: if all fields are clicked- mineCount
  if (++correctCellCount == gameState.length - mineCount) {
    }

  //if (document.querySelectorAll(gridCell_onClick && !mineClicked)) result = gameProgressEnum.win;

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

function showAllBombs() {

    let gridChildren = document.querySelectorAll(".Grid > *");

    for (let i = 0; i < gameState.length; i++) {

      const isMine = gameState[i];

      if (isMine) {

        let fieldDom = gridChildren[i];
        fieldDom.classList.add("Mine");
      }
    }
}

function gridCell_onClick(e){

  if (isGameOver) return;

  let targetCellDom = e.target;
  childrenArray = Array.from(targetCellDom.parentNode.children);
  let cellIndex = childrenArray.indexOf(targetCellDom);
  gameProgressState = checkForEndGame(cellIndex);


  targetCellDom.classList.add("Selected");

  //game over - player lost
  if (gameProgressState == gameProgressEnum.defeat) {

    //game over!
    let gridDom = document.querySelector(".Grid");

    //targetCellDom.classList.add("Mine");

    showAllBombs();

    isGameOver = true;
    // automatically switches to a new screen, not needed!
    //gridDom.innerHTML = "Game Over";

    //alert("You're dead!")

    toggleQuestion();
  }
  //game over - player won
  else if (gameProgressState ==  gameProgressEnum.win) {
  }
  //game is still in progress
  else if (gameProgressState ==   gameProgressEnum.stillInProgress) {

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

function toggleQuestion(e) {

  if (gameProgressState == gameProgressEnum.stillInProgress) return;

  document.querySelector(".Question").style.display = "block";

  //v1
  // if (gameProgressState == 1) {
  //   document.querySelector(".Won").style.display = "block";
  //   document.querySelector(".Lost").style.display = "none";
  // }
  // else {
  //   document.querySelector(".Lost").style.display = "block";
  //   document.querySelector(".Won").style.display = "none";
  // }

  //v2
  document.querySelector(".Won").style.display = gameProgressState == gameProgressEnum.win ? "block" : "none";
  document.querySelector(".Lost").style.display = gameProgressState == gameProgressEnum.defeat ? "block" : "none";
}
