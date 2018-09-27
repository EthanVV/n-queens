// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt((rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt((rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(y) {
      var count = 0;
      for (var x = 0; x < this.attributes.n - 1; x++) {
        if (this.attributes[y][x] === 1) count++;
        if (count > 1) return true;
      }
      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      for (var y = 0; y < this.attributes.n - 1; y++) {
        if (this.hasRowConflictAt(y)) return true;
      }
      return false; // fixme
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var count = 0;
      for ( var i = 0; i < this.attributes.n; i++) {
        if (this.attributes[i][colIndex] === 1) {
          count++;
        }
        if (count > 1) {
          return true;
        }
      }
      return false; // fixme
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      // console.log(this.attributes);
      var boardSize = this.attributes.n
      for (var i = 0; i < boardSize; i++) {
        if (this.hasColConflictAt(i) === true) return true;
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(x, y) { //assumes we are at the top left border of the board;
      var count = 0;
      let checkingX = x;
      let checkingY = y;
      while ((checkingX <= this.attributes.n - 1) && checkingY <= (this.attributes.n - 1)) {
        if (this.attributes[checkingX][checkingY] === 1) count++;
        if (count > 1) return true;
        checkingX++;
        checkingY++;
      }
      checkingX = x - 1;
      checkingY = y - 1;
      while (checkingX >= 0 && checkingY >= 0) {
        if (this.attributes[checkingX][checkingY] === 1) count++;
        if (count > 1) return true;
        checkingX--;
        checkingY--;
      }
      return false; // fixme
    },


    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      for (var x = 0; x < (this.attributes.n - 1); x++) {
        if (this.hasMajorDiagonalConflictAt(x,0)) return true;
      }
      for (var y = 1; y < (this.attributes.n - 1); y++) {
        if (this.hasMajorDiagonalConflictAt(0,y)) return true;
      }
      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(x, y) {//assumes we are at the top right border of the board;
      var count = 0;
      let checkingX = x;
      let checkingY = y;
      while (checkingX >= 0 && checkingY <= this.attributes.n - 1) {
        if (this.attributes[checkingX][checkingY] === 1) count++;
        if (count > 1) return true;
        checkingX--;
        checkingY++;
      }
      checkingX = x + 1;
      checkingY = y - 1;
      while (checkingX <= this.attributes.n - 1 && checkingY >= 0) {
        if (this.attributes[checkingX][checkingY] === 1) count++;
        if (count > 1) return true;
        checkingX++;
        checkingY--;
      }
      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      for (var x = this.attributes.n - 1; x >= 0; x--) {
        if (this.hasMinorDiagonalConflictAt(x, 0)) return true;
      }
      for ( var y = 1; y < this.attributes.n - 1; y++) {
        if (this.hasMinorDiagonalConflictAt((this.attributes.n - 1),y)) return true;
      }
      return false; // fixme
    },

    /*--------------------  End of Helper Functions  ---------------------*/
    // Custom Helper
    numPieces: function() {
      let count = 0;
      for (let y = 0; y < this.attributes.n - 1; y++) {
        for (let x = 0; x < this.attributes.n - 1; x++) {
          if (this.attributes[y][x]) count++;
        }
      }
      return count;
    }
    
  });

    // Custom Helper
  

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
