function $(selector, container) {
  return (container || document).querySelector(selector);
}

(function() {

  var _ = self.Life = function (seed) {
    this.seed = seed;
    this.height = seed.length;
    this.width = seed[0].length;

    this.prevBoard = [];
    this.board = cloneArray(seed);
  };

  _.prototype = {
    next: function () {
      this.prevBoard = cloneArray(this.board);

      for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
          var neighbors = this.aliveNeighbors(this.prevBoard, x, y);
          var alive = !!this.board[y][x];

          if (alive) {
            //rule 1. and 3.
            if (neighbors < 2 || neighbors > 3) {
              this.board[y][x] = 0;
            }
          //rule 2.
          } else {
            if (neighbors === 3 || (this.board[y][x] === 0 && neighbors === 3)) {
              this.board[y][x] = 1;
            }
          }
        }
      }
    },

    aliveNeighbors: function (array, x, y) {
      var prevRow = array[y-1] || [];
      var nextRow = array[y+1] || [];

      return [
        prevRow[x-1], prevRow[x], prevRow[x+1],
        array[y][x-1], array[y][x+1],
        nextRow[x-1], nextRow[x], nextRow[x+1]
      ].reduce(function (prev, cur) {
        return prev +!!cur; //converting undefined to number
      }, 0);
      return sum;
    },

    toString: function () {
      return this.board.map(function (row) { return row.join(' ');}).join('\n');
    }
  };

// helpers
// warning: only clones 2d arrays
function cloneArray(array) {
  return array.slice().map(function (row) { return row.slice();});
}

})();

(function(){
  var _ = self.LifeView = function (table, size, initialBoardArray = []) {
    this.grid = table;
    this.size = size;
    this.started = false;
    this.autoplay = false;

    this.freq = 200;

    this.shapes =
      {
        none: '',
        glider: [[1,1,1],
                [1,0,0],
                [0,1,0]],
        tumbler: [[0,1,1,0,1,1,0],
                [0,1,1,0,1,1,0],
                [0,0,1,0,1,0,0],
                [1,0,1,0,1,0,1],
                [1,0,1,0,1,0,1],
                [1,1,0,0,0,1,1]],
        smallExploder: [[0,1,0],
                        [1,1,1],
                        [1,0,1],
                        [0,1,0]],
        blinker: [[0,0,0],
                  [1,1,1],
                  [0,0,0]],
        toad: [[0,0,0,0],
              [0,1,1,1],
              [1,1,1,0],
              [0,0,0,0]]
      };

    this.createGrid(initialBoardArray);
  };
  _.prototype = {
    createGrid: function (initialBoardArray) {
      var me = this;
      var fragment = document.createDocumentFragment();
      this.grid.innerHTML = '';
      this.checkboxes = [];

      const isInitialBoardPassed = initialBoardArray.length > 0;
      const [initialBoardX, initialBoardY] = [
        Math.min(initialBoardArray.length, this.size),
        Math.min(initialBoardArray.length ? initialBoardArray[0].length : 0, this.size)
      ];

      for (var y = 0; y < this.size; y++) {
        var row = document.createElement('tr');
        this.checkboxes[y] = [];

        for (var x = 0; x < this.size; x++) {
          var cell = document.createElement('td');
          var checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          this.checkboxes[y][x] = checkbox;
          checkbox.coords = [y, x];

          if (isInitialBoardPassed && x < initialBoardX && y < initialBoardY) {
            checkbox.checked = !!initialBoardArray[y][x];
          }

          cell.appendChild(checkbox);
          row.appendChild(cell);
        }

        fragment.appendChild(row);
      }
      this.grid.addEventListener('change', function(evt) {
        if (evt.target.nodeName.toLowerCase() == 'input') {
          me.started = false;
        }

      });

      const self = this;

      this.grid.addEventListener('click', function(evt) {
        var coords = evt.target.coords;
        if (!coords) {
          return;
        }
        var choice = pattern;
        const size = self.checkboxes.length;
        if (choice !== "none" && choice != undefined){
          for (var y = 0; y < me.shapes[choice].length; y++) {
            for (var x = 0; x < me.shapes[choice][0].length; x++) {
              if (y + coords[0] < size && x + coords[1] < size) {
                me.checkboxes[y + coords[0]][x + coords[1]].checked = !!me.shapes[choice][y][x];
              }
            }
          }
        }
      });

      this.grid.addEventListener('keyup', function(evt) {
        var checkbox = evt.target;
        console.log(checkbox.coords);
        if (checkbox.nodeName.toLowerCase() == 'input') {
          var coords = checkbox.coords;
          var y = coords[0];
          var x = coords[1];
          console.log(evt.keyCode);

          switch (evt.keyCode) {
            case 37: //left
              if (x > 0) {
                me.checkboxes[y][x-1].focus();
              }
              break;
            case 38: //up
              if (y > 0) {
                me.checkboxes[y-1][x].focus();
              }
              break;
            case 39: //right
              if (x < me.size - 1) {
                me.checkboxes[y][x+1].focus();
              }
              break;
            case 40: //down
              if (y < me.size - 1) {
                me.checkboxes[y+1][x].focus();
              }
              break;
          }
        }
      });

      this.grid.appendChild(fragment);
    },

    get boardArray() {
      return this.checkboxes.map( function (row) {
        return row.map(function (checkbox) {
          return +checkbox.checked;
        });
      });
    },

    play: function () {
      this.game = new Life(this.boardArray);
      this.started = true;
    },

    next: function (){
      var me = this;
      var nothingChanged = true;

      if (!this.started || this.game) {
        this.play();
      }
      this.game.next();
      var board = this.game.board;

      for (var y = 0; y < this.size; y++) {
        for (var x = 0; x < this.size; x++) {
          this.checkboxes[y][x].checked = !!board[y][x];
          if (this.game.board[y][x] !== this.game.prevBoard[y][x]) {
            nothingChanged = false;
          }
        }
      }


      if (!nothingChanged) {
        $('#ifPaused').textContent = '';
        if (this.autoplay) {
          this.timer = setTimeout(function () {
            me.next();
          }, lifeView.freq);
        }
      } else {
        $('button.next').disabled = false;
        $('input#autoplay').checked = false;
        $('#ifPaused').textContent = "Nothing to update on board...";
      }
    },

    drawNewBoardByGridAndCell: function(gridDensity, cellSize, initialBoardArray = []) {
      lifeView = new LifeView(document.getElementById('grid'), gridDensity, initialBoardArray);
      var temp = document.querySelectorAll('#grid input[type="checkbox"]');
      for (var i = 0; i < temp.length; i++) {
        temp[i].style.width = cellSize + 'px';
        temp[i].style.height = cellSize + 'px';
      }
      lifeView.freq = 1000 / $('#freq').value;
      $('button.next').disabled = false;
      $('input#autoplay').checked = false;
    }
  };
})();

var pattern;
var lifeView = new LifeView(document.getElementById('grid'), 35);
// lifeView.reset();

(function() {
  var settings = {
    next: $('button.next'),
    autoplay: $('#autoplay'),
    gridDensity: $('#gridDensity'),
    freq: $('#freq'),
    reset: $('button.reset'),
    patternForm: $('#patternForm')
  };

  settings.next.addEventListener('click', function(event) {
    lifeView.autoplay = this.checked;
    lifeView.next();
  });

  settings.autoplay.addEventListener('change', function(event) {
    settings.next.disabled = this.checked;

    if (this.checked ) {
      lifeView.autoplay = this.checked;
      lifeView.next();
    } else {
      clearTimeout(lifeView.timer);
    }
  });

  settings.gridDensity.addEventListener('change', function(event) {
    var optimalHeight = 375;
    var size = Math.round((optimalHeight - this.value) / this.value);

    const boardCached = [...lifeView.boardArray];
    lifeView.drawNewBoardByGridAndCell(this.value, size, boardCached);
    $('#gridDensityValue').textContent = this.value;
  });

  settings.freq.addEventListener('change', function(event) {
    lifeView.freq = 1000 / settings.freq.value;
    $('#rangeValue').textContent = settings.freq.value;
  });

  settings.reset.addEventListener('click', function(event) {
    console.log("reset");
    var optimalHeight = 375;
    var size = Math.floor((optimalHeight-settings.gridDensity.value)/settings.gridDensity.value);
    lifeView.drawNewBoardByGridAndCell(settings.gridDensity.value, size);
  });

  settings.patternForm.addEventListener('change', function(e) {
    console.log(e.target.value);
    pattern = e.target.value;
  });

})();
