import Node from "./Node";
import Edge from "./Edge";
import KrusSet from "./KrusSet";
import {
  ROWS,
  COLUMNS,
  SQUARE_SIZE,
  WIDTH,
  HEIGHT,
  WALL_GENERATION_ALGO,
} from "./Constants";

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

    // Krus
    this.edges = [];
    this.sets = [];

    // Prims
    this.frontier = [];
    this.frontier_length = 1;

    // A*
    this.openSet = [];
    this.closedSet = [];

    this.path = [];

    this.current = undefined;

    this.p = p;

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

    this.previous_path = [];

    this.init();
  }

  init() {
    console.log(this);
    var isPassage = false;
    this.grid = new Array(this.cols);
    this.sets = new Array(this.cols);

    for (var i = 0; i < this.cols; i++) {
      this.grid[i] = new Array(this.rows);
      this.sets[i] = new Array(this.rows);

      for (var j = 0; j < this.rows; j++) {
        let walls = [];
        if (i > 0) {
          walls.push(this.grid[i - 1][j]);
        }
        if (j > 0) {
          walls.push(this.grid[i][j - 1]);
        }

        this.grid[i][j] = new Node(this.p, i, j, this.w, this.h, walls);
        this.sets[i][j] = new KrusSet(this.grid[i][j]);

        if (i > 0) {
          this.edges.push(new Edge(this.grid[i][j], this.grid[i - 1][j]));
          this.grid[i - 1][j].addToWalls(this.grid[i][j]);
        }
        if (j > 0) {
          this.edges.push(new Edge(this.grid[i][j], this.grid[i][j - 1]));
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

    this.mark(this.current);

    this.openSet.push(this.start);

    this.finished = false;

    this.maze_draw_counter = 0;

    this.generation_timestep = 0;
    this.drawing_timestep = 0;
    this.drawing_step = 0;
  }

  addToFrontier(node) {
    if (
      node.posx >= 0 &&
      node.posy >= 0 &&
      node.posx < this.cols &&
      node.posy < this.rows &&
      !node.isChecked &&
      !node.isFrontier
    ) {
      node.setFrontier(true, this.generation_timestep);
      this.frontier.push(node);
    }
  }

  generate_all_walls(type) {
    if (parseInt(type) === WALL_GENERATION_ALGO.PRIM) {
      while (this.frontier.length > 0) {
        this.stepPrimsMaze();
      }
    }

    if (parseInt(type) === WALL_GENERATION_ALGO.KRUS) {
      while (this.edges.length > 0) {
        this.stepKrusMaze();
      }
    }
  }

  generate_all_walls_with_steps(step, type) {
    this.drawing_step = step;
    this.set_node_value();

    if (parseInt(type) === WALL_GENERATION_ALGO.PRIM) {
      while (this.frontier.length > 0) {
        this.stepPrimsMaze();
        this.generation_timestep += 1;
      }
    }
    if (parseInt(type) === WALL_GENERATION_ALGO.KRUS) {
      while (this.edges.length > 0) {
        this.stepKrusMaze();
        this.generation_timestep += 1;
      }
    }
  }

  // Generated using Prim's Algorithm with Flooding
  stepPrimsMaze() {
    let rand = Math.floor((this.frontier.length - 1) * Math.random());

    let node = this.frontier.splice(rand, 1)[0];
    node.setFrontier(false);

    let walls = this.get_neighbours(node);
    let wall = walls[Math.floor((walls.length - 1) * Math.random())];

    if (wall == null) {
      console.log("Null");
    }

    console.log(node, wall);
    node.removeWall(wall, this.generation_timestep);
    wall.removeWall(node, this.generation_timestep);

    this.mark(node);
  }

  // Generated using kruskal
  stepKrusMaze() {
    let rand = Math.floor(this.edges.length * Math.random());
    let edge = this.edges[rand];

    this.edges.splice(rand, 1);

    let set1 = this.sets[edge.node1.posx][edge.node1.posy];
    let set2 = this.sets[edge.node2.posx][edge.node2.posy];

    if (!set1.is_connected(set2)) {
      set1.connect(set2);
      edge.node1.removeWall(edge.node2, this.generation_timestep);
      edge.node2.removeWall(edge.node1, this.generation_timestep);
    }

    //this.drawDrawing();
  }

  updateMazeStep(step) {
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

  mark(node) {
    let i = node.posx;
    let j = node.posy;

    node.isChecked = true;

    if (i < this.cols - 1) {
      this.addToFrontier(this.grid[i + 1][j]);
    }
    if (i > 0) {
      this.addToFrontier(this.grid[i - 1][j]);
    }
    if (j < this.rows - 1) {
      this.addToFrontier(this.grid[i][j + 1]);
    }
    if (j > 0) {
      this.addToFrontier(this.grid[i][j - 1]);
    }
  }

  get_neighbours(node) {
    let n = [];

    let i = node.posx;
    let j = node.posy;

    if (i < this.cols - 1 && this.grid[i + 1][j].isChecked) {
      n.push(this.grid[i + 1][j]);
    }
    if (i > 0 && this.grid[i - 1][j].isChecked) {
      n.push(this.grid[i - 1][j]);
    }
    if (j < this.rows - 1 && this.grid[i][j + 1].isChecked) {
      n.push(this.grid[i][j + 1]);
    }
    if (j > 0 && this.grid[i][j - 1].isChecked) {
      n.push(this.grid[i][j - 1]);
    }

    return n;
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
      this.closedSet[y].showPath(this.p.color(255, 0, 0, 50));
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
