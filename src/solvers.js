/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function(n) {
  var solution = new Board({n: n}); //fixme
  for (var i = 0; i < solution.attributes.n; i++) {
    solution.togglePiece(i,i);
  }
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution.rows();
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  const factorial = function(n) {
    if (n === 0) return 1;
    return factorial(n - 1) * n;
  }
  let solutionCount = factorial(n);
  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  let testBoard = new Board({n: n});
  let answer = null;
  var check = false;

  if (n === 2 || n === 3) {
    return testBoard.rows();
  }
  // elegent code right here
  var testRow = function(row) {
    if (!check) {
      if (row === n) {
        console.log(testBoard)
        answer = testBoard.rows()
        check = true;
      }
      else {
        for (let i = 0; i < n; i++) {
          if (!check) {
            testBoard.togglePiece(row, i);
            if (!testBoard.hasAnyQueensConflicts()) {
              testRow(row + 1);
            }
            if (!check) {
              testBoard.togglePiece(row, i);
            }
          }
        }
      }
    }
  };
  testRow(0);
  console.log('Single solution for ' + n + ' queens:', JSON.stringify(testBoard.rows()));
  return answer;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  /*
  * 
  */ 

  let solutionCount = 0;
  let testBoard = new Board({n: n});
  var testRow = function(row) {//input is a row in the matrix
    if (row === n) {  //if there is no more pieces to place
      solutionCount++; //add one to the solution count
      return; //exit
    }
    for (var i = 0; i < n; i++) { //for the input row
      testBoard.togglePiece(row, i) //toggle each piece
      if (!testBoard.hasAnyQueensConflicts()) { // check if any conflicts
        testRow(row + 1); //if none move on to next row
      }
      testBoard.togglePiece(row, i) //if conflicts toggle piece back
    }
  }
  testRow(0); //start at row one
  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
}
