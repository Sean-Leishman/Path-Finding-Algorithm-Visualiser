import Node from "./Node";
import { ROWS, COLUMNS, SQUARE_SIZE, WIDTH, HEIGHT } from "./Constants";

function heuristic(a, b, p) {
  //var d = abs(a.i - b.i) + abs(a.j - b.j);
  var d = p.dist(a.posx, a.posy, b.posx, b.posy);
  return d;
}

function removeFromArray(arr, val) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === val) {
      arr.splice(i, 1);
    }
  }
}

class Grid {
  constructor(p) {
    this.width = WIDTH;
    this.height = HEIGHT;

    this.rows = ROWS;
    this.cols = COLUMNS;

    this.w = SQUARE_SIZE;
    this.h = SQUARE_SIZE;

    this.frontier = [];

    this.openSet = [];
    this.closedSet = [];

    this.path = [];

    this.current = undefined;

    this.p = p;

    this.frontier_length = 1;

    this.previous_path = [];
    this.init();
  }

  reset() {
    this.width = WIDTH;
    this.height = HEIGHT;

    this.rows = ROWS;
    this.cols = COLUMNS;

    this.w = SQUARE_SIZE;
    this.h = SQUARE_SIZE;

    this.frontier = [];

    this.openSet = [];
    this.closedSet = [];
    this.visitedSet = [];

    this.path = [];

    this.current = undefined;

    this.p = this.p;

    this.frontier_length = 1;

    this.previous_path = [];

    this.init();
  }

  init() {
    console.log(this);
    var isPassage = false;
    this.grid = new Array(this.cols);
    for (var i = 0; i < this.cols; i++) {
      this.grid[i] = new Array(this.rows);
      for (var j = 0; j < this.rows; j++) {
        let walls = [];
        if (i > 0) {
          walls.push(this.grid[i - 1][j]);
        }
        if (j > 0) {
          walls.push(this.grid[i][j - 1]);
        }
        this.grid[i][j] = new Node(this.p, i, j, this.w, this.h, walls);
        if (i > 0) {
          this.grid[i - 1][j].addToWalls(this.grid[i][j]);
        }
        if (j > 0) {
          this.grid[i][j - 1].addToWalls(this.grid[i][j]);
        }
      }
    }
    var startCoords = [
      Math.floor((this.cols - 1) * Math.random()),
      Math.floor((this.rows - 1) * Math.random()),
    ];
    var endCoords = [
      Math.floor((this.cols - 1) * Math.random()),
      Math.floor((this.rows - 1) * Math.random()),
    ];
    this.start = this.grid[startCoords[0]][startCoords[1]];
    this.end = this.grid[endCoords[0]][endCoords[1]];

    this.start.start = true;

    this.start = this.grid[startCoords[0]][startCoords[1]];
    this.end = this.grid[endCoords[0]][endCoords[1]];

    this.end.end = true;

    this.current = this.start;

    this.current.isChecked = true;

    this.passage = [this.current];
    this.passage_with_sons = [this.current];

    this.getFrontier();

    this.addNeighbors();

    this.openSet.push(this.start);

    this.finished = false;

    this.maze_draw_counter = 0;

    this.generation_timestep = 0;
    this.drawing_timestep = 0;
    this.drawing_step = 0;
  }

  getFrontier() {
    for (var i = 0; i < this.passage.length; i++) {
      let x = this.passage[i].posx;
      let y = this.passage[i].posy;
      if (x > 0) {
        if (
          !this.grid[x - 1][y].isChecked &&
          !this.passage[i].isValid(this.grid[x - 1][y])
        ) {
          this.frontier.push(this.grid[x - 1][y]);
          this.grid[x - 1][y].isFrontier = true;

          if (this.grid[x][y].sons.indexOf(this.grid[x - 1][y]) == -1) {
            this.grid[x][y].sons.push(this.grid[x - 1][y]);
          }
        }
      }
      if (y > 0) {
        if (
          !this.grid[x][y - 1].isChecked &&
          !this.passage[i].isValid(this.grid[x][y - 1])
        ) {
          this.frontier.push(this.grid[x][y - 1]);
          this.grid[x][y - 1].isFrontier = true;
          if (this.grid[x][y].sons.indexOf(this.grid[x][y - 1]) == -1) {
            this.grid[x][y].sons.push(this.grid[x][y - 1]);
          }
        }
      }
      if (y < this.rows - 1) {
        if (
          !this.grid[x][y + 1].isChecked &&
          !this.passage[i].isValid(this.grid[x][y + 1])
        ) {
          this.grid[x][y + 1].isFrontier = true;
          this.frontier.push(this.grid[x][y + 1]);
          if (this.grid[x][y].sons.indexOf(this.grid[x][y + 1]) == -1) {
            this.grid[x][y].sons.push(this.grid[x][y + 1]);
          }
        }
      }
      if (x < this.cols - 1) {
        if (
          !this.grid[x + 1][y].isChecked &&
          !this.passage[i].isValid(this.grid[x + 1][y])
        ) {
          this.frontier.push(this.grid[x + 1][y]);
          this.grid[x + 1][y].isFrontier = true;
          if (this.grid[x][y].sons.indexOf(this.grid[x + 1][y]) == -1) {
            this.grid[x][y].sons.push(this.grid[x + 1][y]);
          }
        }
      }
    }
  }

  generate_all_walls() {
    while (this.frontier.length > 0) {
      this.stepPrimsMaze();
    }
  }

  generate_all_walls_with_steps(step) {
    this.drawing_step = step;
    this.set_node_value();

    while (this.frontier.length > 0) {
      this.stepPrimsMaze();
      console.log(
        this.frontier.length,
        this.generation_timestep,
        this.passage.length
      );
      // for (var i = 0; i < this.cols; i++) {
      //   for (var j = 0; j < this.rows; j++) {
      //     this.grid[i][j].copy_node();
      //   }
      // }
      this.generation_timestep += 1;
    }
  }

  convertWallBetweenFrontierAndPassage(a) {
    if (a.posx === this.current.posx) {
      if (a.posy > this.current.posy) {
        this.grid[a.posx][a.posy - 1].isChecked = true;

        this.grid[a.posx][a.posy - 1].removeWall(
          this.grid[a.posx][a.posy],
          this.generation_timestep
        );
        this.grid[a.posx][a.posy].removeWall(
          this.grid[a.posx][a.posy - 1],
          this.generation_timestep
        );
        this.passage.push(this.grid[a.posx][a.posy - 1]);
      } else {
        this.grid[a.posx][a.posy + 1].isChecked = true;

        this.grid[a.posx][a.posy + 1].removeWall(
          this.grid[a.posx][a.posy],
          this.generation_timestep
        );
        this.grid[a.posx][a.posy].removeWall(
          this.grid[a.posx][a.posy + 1],
          this.generation_timestep
        );
        this.passage.push(this.grid[a.posx][a.posy + 1]);
      }
    } else if (a.posy === this.current.posy) {
      if (a.posx > this.current.posx) {
        this.grid[a.posx - 1][a.posy].isChecked = true;

        this.grid[a.posx - 1][a.posy].removeWall(
          this.grid[a.posx][a.posy],
          this.generation_timestep
        );
        this.grid[a.posx][a.posy].removeWall(
          this.grid[a.posx - 1][a.posy],
          this.generation_timestep
        );
        this.passage.push(this.grid[a.posx - 1][a.posy]);
      } else {
        this.grid[a.posx + 1][a.posy].isChecked = true;

        this.grid[a.posx + 1][a.posy].removeWall(
          this.grid[a.posx][a.posy],
          this.generation_timestep
        );
        this.grid[a.posx][a.posy].removeWall(
          this.grid[a.posx + 1][a.posy],
          this.generation_timestep
        );
        this.passage.push(this.grid[a.posx + 1][a.posy]);
      }
    }
  }

  // Generated using Prim's Algorithm with Flooding
  stepPrimsMaze() {
    let rand = Math.floor(this.passage_with_sons.length * Math.random());
    this.current = this.passage_with_sons[rand];
    while (this.current.sons.length === 0) {
      this.passage_with_sons.splice(rand, 1);
      rand = Math.floor(this.passage_with_sons.length * Math.random());
      this.current = this.passage_with_sons[rand];
    }
    let temp =
      this.current.sons[Math.floor(this.current.sons.length * Math.random())];
    this.convertWallBetweenFrontierAndPassage(temp);
    temp.isChecked = true;
    temp.isFrontier = false;

    this.passage.push(temp);
    this.passage_with_sons.push(temp);
    this.frontier = [];
    this.getFrontier();
    removeFromArray(this.current.sons, temp);

    let i = temp.posx;
    let j = temp.posy;
    if (i > 0) {
      removeFromArray(this.grid[i - 1][j].sons, temp);
    }
    if (j > 0) {
      removeFromArray(this.grid[i][j - 1].sons, temp);
    }
    if (i < this.grid.length - 1) {
      removeFromArray(this.grid[i + 1][j].sons, temp);
    }
    if (j < this.grid[0].length - 1) {
      removeFromArray(this.grid[i][j + 1].sons, temp);
    }
  }

  updateMazeStep(step) {
    //this.stepPrimsMaze();

    // if (
    //   this.passage.length % this.frontier_length < 2 &&
    //   this.maze_draw_counter >= 0
    // ) {
    //   // this.p.background(255);
    //   this.frontier_length = this.frontier.length + 1;
    //   this.maze_draw_counter = 0;
    //   this.drawDrawing();
    // }

    // this.maze_draw_counter += 1;
    if (this.drawing_timestep >= this.generation_timestep) {
      return true;
    }

    for (var i = 0; i < this.cols; i++) {
      for (var j = 0; j < this.rows; j++) {
        this.grid[i][j].showMazeHistory(this.drawing_timestep);
      }
    }

    this.drawing_timestep += step;

    return false;
  }

  drawDrawing() {
    this.p.background(255);
    for (var i = 0; i < this.cols; i++) {
      for (var j = 0; j < this.rows; j++) {
        this.grid[i][j].showMaze(1);
      }
    }
  }

  addNeighbors() {
    for (var i = 0; i < this.cols; i++) {
      for (var j = 0; j < this.rows; j++) {
        // if (i < this.cols - 1) {
        //   this.grid[i][j].neighbours.push(this.grid[i + 1][j]);
        // }
        // if (i > 0) {
        //   this.grid[i][j].neighbours.push(this.grid[i - 1][j]);
        // }
        // if (j < this.rows - 1) {
        //   this.grid[i][j].neighbours.push(this.grid[i][j + 1]);
        // }
        // if (j > 0) {
        //   this.grid[i][j].neighbours.push(this.grid[i][j - 1]);
        // }
        // if (j > 0 && i > 0) {
        //   this.grid[i][j].neighbours.push(this.grid[i - 1][j - 1]);
        // }
        // if (j < this.rows - 1 && i < this.cols - 1) {
        //   this.grid[i][j].neighbours.push(this.grid[i + 1][j + 1]);
        // }
        // if (j > 0 && i < this.cols - 1) {
        //   this.grid[i][j].neighbours.push(this.grid[i + 1][j - 1]);
        // }
        // if (j < this.rows - 1 && i > 0) {
        //   this.grid[i][j].neighbours.push(this.grid[i - 1][j + 1]);
        // }
      }
    }
  }

  showAStarPath() {
    if (this.openSet.length > 0) {
      var winner = 0;
      for (var i = 0; i < this.openSet.length; i++) {
        if (this.openSet[i].f < this.openSet[winner].f) {
          winner = i;
        }
      }

      this.current = this.openSet[winner];
      if (this.current !== this.end) {
        //this.p.noLoop();
        removeFromArray(this.openSet, this.current);
        this.closedSet.push(this.current);

        var neighbours = this.current.neighbours;
        for (var m = 0; m < neighbours.length; m++) {
          var neighbour = neighbours[m];
          if (neighbour) {
            if (!this.closedSet.includes(neighbour)) {
              var tempG =
                this.current.g + heuristic(neighbour, this.current, this.p);
              var newPath = false;
              if (this.openSet.includes(neighbour)) {
                if (tempG < neighbour.g) {
                  neighbour.g = tempG;
                  newPath = true;
                }
              } else {
                neighbour.g = tempG;
                newPath = true;
                this.openSet.push(neighbour);
              }
              if (newPath) {
                neighbour.h = heuristic(neighbour, this.end, this.p);
                neighbour.f = neighbour.g + neighbour.h;
                neighbour.parent = this.current;
              }
            }
          }
        }
      } else {
        this.finished = true;
      }
    } else {
      // no solution
    }
    this.drawAStarPath();
  }

  drawAStarPath() {
    // for (var i = 0; i < this.cols; i++) {
    //   for (var j = 0; j < this.rows; j++) {
    //     this.grid[i][j].showMaze();
    //     if (this.grid[i][j].isPassage) {
    //       this.grid[i][j].showPath(this.p.color(255));
    //     } else {
    //       this.grid[i][j].showPath(this.p.color(0));
    //     }
    //   }
    // }

    for (var x = 0; x < this.openSet.length; x++) {
      this.openSet[x].showPath(this.p.color(0, 0, 255, 50));
    }

    for (var y = 0; y < this.closedSet.length; y++) {
      // this.p.color(255, 255, 255, 50)
      this.closedSet[y].showPath();
    }

    this.start.showPath(this.p.color(255, 0, 0));
    this.end.showPath(this.p.color(0, 255, 0));

    // Find the path by working backwards
    this.path = [];
    var temp = this.current;
    this.path.push(temp);
    while (temp.parent !== undefined) {
      this.path.push(temp.parent);
      temp = temp.parent;
    }

    // Drawing path as continuous line
    this.p.noFill();
    this.p.stroke(255, 0, 200);
    this.p.strokeWeight(this.w / 2);
    this.p.beginShape();
    for (var k = 0; k < this.path.length; k++) {
      this.p.vertex(
        this.path[k].posx * this.w + this.w / 2,
        this.path[k].posy * this.h + this.h / 2
      );
    }
    this.p.endShape();
  }

  set_node_value() {
    for (var i = 0; i < this.cols; i++) {
      for (var j = 0; j < this.rows; j++) {
        this.grid[i][j].drawing_step = this.drawing_step;
      }
    }
  }
}

export default Grid;
