let gameState = null;

document.addEventListener("DOMContentLoaded", function(event) {
  let gridSize_x = 10;
  let gridSize_y = 10;
  let mineCount = 30;

  gameState = generatedGameState(gridSize_x, gridSize_y, mineCount);

  console.log("gameState", gameState)

  bindUI(gameState);
});

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

  for (let i = 0; i < gameState.length; i++) {

    let fieldDom = document.createElement("div");
    fieldDom.classList.add("Field");

    gridDom.appendChild(fieldDom);

    if (gameState[i] == true) {

      fieldDom.innerHTML = "*";
    }

    fieldDom.addEventListener("click", gridCell_onClick);
  }
}

function gridCell_onClick(e){

  let targetCell = e.target;
  let childrenArray = Array.from(targetCell.parentNode.children);
  let cellIndex = childrenArray.indexOf(targetCell);

  let userAction = gameState[cellIndex];

  if (userAction) {

    //game over!
    let gridDom = document.querySelector(".Grid");
    gridDom.innerHTML = "Game Over";
    //todo: refacture
    alert("You're dead!")
  }
  else {


     let leftCellIndex = cellIndex - 1;
     let rightCellIndex = cellIndex + 1;
     let topCellIndex = cellIndex - 10;
     let bottomCellIndex = cellIndex + 10;
     let topLeftCellIndex = cellIndex - 10 - 1;
     let topRightCellIndex = cellIndex - 10 + 1;
     let bottomLeftCellIndex = cellIndex + 10 - 1;
     let bottomRightCellIndex = cellIndex + 10 + 1;

     let rowIndex = Math.floor(cellIndex / 10);


     let checkIfCellIsMine = function (pendingIndex, rowIndex){

      let isMine = false;

      let isValidRowIndex = Math.floor(pendingIndex / 10) == rowIndex;

      if (isValidRowIndex && pendingIndex >= 0 && pendingIndex < gameState.length) {
        if (gameState[pendingIndex]) isMine = true;
       }

       return isMine;
     }
     let minesAround = 0;

     if (checkIfCellIsMine(leftCellIndex, rowIndex)) minesAround++;
     if (checkIfCellIsMine(rightCellIndex, rowIndex)) minesAround++;
     if (checkIfCellIsMine(topCellIndex, rowIndex - 1)) minesAround++;
     if (checkIfCellIsMine(bottomCellIndex, rowIndex + 1)) minesAround++;
     if (checkIfCellIsMine(topLeftCellIndex, rowIndex - 1)) minesAround++;
     if (checkIfCellIsMine(topRightCellIndex, rowIndex - 1)) minesAround++;
     if (checkIfCellIsMine(bottomLeftCellIndex, rowIndex + 1)) minesAround++;
     if (checkIfCellIsMine(bottomRightCellIndex, rowIndex + 1)) minesAround++;

     targetCell.innerHTML = minesAround;

    console.log(minesAround);
  }
}
