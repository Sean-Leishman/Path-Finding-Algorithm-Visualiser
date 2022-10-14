import Node from './Node';
import { ROWS, COLUMNS, SQUARE_SIZE, WIDTH, HEIGHT } from './Constants';

function heuristic(a,b,p){
    //var d = abs(a.i - b.i) + abs(a.j - b.j);
    var d = p.dist(a.posx,a.posy,b.posx,b.posy);
    return d;
}

function removeFromArray(arr, val){
    for (var i = arr.length-1; i>=0; i--){
        if (arr[i] === val){
            arr.splice(i,1);
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

        this.init();
    }

    init(){
        console.log(this)
        var isPassage = false;
        this.grid = new Array(this.cols);
        for (var i = 0; i < this.cols; i++){
            this.grid[i] = new Array(this.rows);
            for (var j = 0; j < this.rows; j++){
                isPassage = ((i % 2 === 0) && (j % 2 === 0))
                this.grid[i][j] = new Node(this.p,i,j,this.w,this.h,isPassage);
            }
        }
        var startCoords = [Math.floor((this.cols - 1) * Math.random()), Math.floor((this.rows - 1) * Math.random())];
        var endCoords = [Math.floor((this.cols - 1) * Math.random()), Math.floor((this.rows - 1) * Math.random())];
        this.start = this.grid[startCoords[0]][startCoords[1]]
        this.end = this.grid[endCoords[0]][endCoords[1]]

        while (!this.start.isPassage){
            startCoords = [Math.floor((this.cols - 1) * Math.random()), Math.floor((this.rows - 1) * Math.random())];
            this.start = this.grid[startCoords[0]][startCoords[1]]
        }

        this.start.start = true;

        while (!this.end.isPassage){
            endCoords = [Math.floor((this.cols - 1) * Math.random()), Math.floor((this.rows - 1) * Math.random())];
            this.end = this.grid[endCoords[0]][endCoords[1]]
        }

        startCoords = [2,4];
        endCoords = [124,54];
        this.start = this.grid[startCoords[0]][startCoords[1]]
        this.end = this.grid[endCoords[0]][endCoords[1]]

        this.end.end = true;

        this.current = this.start;

        this.current.isChecked = true;

        this.passage = [this.current];

        this.getFrontier();

        this.addNeighbors();

        this.openSet.push(this.start);
    }

    getFrontier(){
        for (var i = 0; i < this.passage.length; i++) {
            let x = this.passage[i].posx
            let y = this.passage[i].posy
            if (x > 1) {
                if (!this.grid[x - 2][y].isChecked && this.grid[x-2][y].isPassage) {
                    this.grid[x - 2][y].isFrontier = true;
                    this.frontier.push(this.grid[x - 2][y]);
                    this.grid[x][y].sons.push(this.grid[x-2][y]);
                }
            }
            if (y > 1) {
                if (!this.grid[x][y - 2].isChecked && this.grid[x][y-2].isPassage) {
                    this.grid[x][y - 2].isFrontier = true;
                    this.frontier.push(this.grid[x][y - 2]);
                    this.grid[x][y].sons.push(this.grid[x][y-2]);
                }
            }
            if (y < this.rows - 2) {
                if (!this.grid[x][y + 2].isChecked && this.grid[x][y+2].isPassage) {
                    this.grid[x][y + 2].isFrontier = true;
                    this.frontier.push(this.grid[x][y + 2]);
                    this.grid[x][y].sons.push(this.grid[x][y+2]);
                }
            }
            if (x < this.cols - 2) {
                if (!this.grid[x + 2][y].isChecked && this.grid[x+2][y].isPassage) {
                    this.grid[x + 2][y].isFrontier = true;
                    this.frontier.push(this.grid[x + 2][y]);
                    this.grid[x][y].sons.push(this.grid[x+2][y]);
                }
            }
        }
    }

    generate_walls(){
        while (this.frontier.length > 0){
            let rand = Math.floor(this.passage.length * Math.random());
            this.current = this.passage[rand];
            while (this.current.sons.length === 0){
                rand = Math.floor(this.passage.length * Math.random())
                this.current = this.passage[rand];
            }
            let temp = this.current.sons[Math.floor(this.current.sons.length * Math.random())]
            this.convertWallBetweenFrontierAndPassage(temp);
            temp.isChecked = true;
            temp.isFrontier = false;
            this.passage.push(temp);
            this.frontier = [];
            this.getFrontier();
            removeFromArray(this.current.sons, temp)
            for (var i = 0; i < this.grid.length; i++){
                for (var j = 0; j < this.grid[i].length; j ++){
                    removeFromArray(this.grid[i][j].sons, temp);
                }
            }
        }
    }

    convertWallBetweenFrontierAndPassage(a){
        if (a.posx === this.current.posx){
            if (a.posy > this.current.posy){
                this.grid[a.posx][a.posy - 1].isPassage = true;
                this.grid[a.posx][a.posy - 1].isObstacle = false;
                this.passage.push(this.grid[a.posx][a.posy - 1]);
                this.grid[a.posx][a.posy - 1].isChecked = true;
            }
            else{
                this.grid[a.posx][a.posy + 1].isPassage = true;
                this.grid[a.posx][a.posy + 1].isObstacle = false;
                this.passage.push(this.grid[a.posx][a.posy + 1]);
                this.grid[a.posx][a.posy + 1].isChecked = true;
            }
        }
        else if (a.posy === this.current.posy){
            if (a.posx > this.current.posx){
                this.grid[a.posx - 1][a.posy].isPassage = true;
                this.grid[a.posx - 1][a.posy].isObstacle = false;
                this.passage.push(this.grid[a.posx - 1][a.posy]);
                this.grid[a.posx - 1][a.posy].isChecked = true;
            }
            else{
                this.grid[a.posx + 1][a.posy].isPassage = true;
                this.grid[a.posx + 1][a.posy].isObstacle = false;
                this.passage.push(this.grid[a.posx + 1][a.posy])
                this.grid[a.posx + 1][a.posy].isChecked = true;
            }
        }
    }

    showDrawing(){
        let rand = Math.floor(this.passage.length * Math.random());
        this.current = this.passage[rand];
        while (this.current.sons.length === 0){
            rand = Math.floor(this.passage.length * Math.random())
            this.current = this.passage[rand];
        }
        let temp = this.current.sons[Math.floor(this.current.sons.length * Math.random())]
        this.convertWallBetweenFrontierAndPassage(temp);
        temp.isChecked = true;
        temp.isFrontier = false;
        this.passage.push(temp);
        this.frontier = [];
        this.getFrontier();
        removeFromArray(this.current.sons, temp)
        for (var i = 0; i < this.grid.length; i++){
            for (var j = 0; j < this.grid[i].length; j ++){
                removeFromArray(this.grid[i][j].sons, temp);
            }
        }
        console.log(this.passage.length, this.frontier_length, this.frontier.length)
        if (this.passage.length % this.frontier_length < 2){
            this.frontier_length = this.frontier.length + 1;
            this.drawDrawing()
        }
    }

    drawDrawing(){
        for (var i = 0; i < this.cols; i++){
            for (var j = 0; j < this.rows; j ++){
                this.grid[i][j].showMaze(this.p.color(255))
            }
        }

        for (var x = 0; x < this.frontier.length; x++){
            this.frontier[x].showMaze(this.p.color(255))
        }
    }

    addNeighbors(){
        for (var i = 0; i < this.cols; i++){
            for (var j = 0; j < this.rows; j++){
                console.log(i,j)
                if (i < this.cols - 1){
                    this.grid[i][j].neighbours.push(this.grid[i + 1][j]);
                }

                if (i > 0){
                    this.grid[i][j].neighbours.push(this.grid[i - 1][j]);
                }

                if (j < this.rows - 1){
                    this.grid[i][j].neighbours.push(this.grid[i][j + 1]);
                }

                if (j > 0){
                    this.grid[i][j].neighbours.push(this.grid[i][j - 1]);
                }

                if (j > 0 && i > 0){
                    this.grid[i][j].neighbours.push(this.grid[i-1][j-1]);
                }

                if (j < this.rows - 1 && i < this.cols - 1){
                    this.grid[i][j].neighbours.push(this.grid[i+1][j+1]);
                }

                if (j > 0 && i < this.cols - 1){
                    this.grid[i][j].neighbours.push(this.grid[i+1][j-1]);
                }

                if (j < this.rows-1 && i > 0){
                    this.grid[i][j].neighbours.push(this.grid[i-1][j+1]);
                }
            }
        }
    }

    showPath(){
        if (this.openSet.length > 0) {
            var winner = 0;
            for (var i = 0; i < this.openSet.length; i++){
                if (this.openSet[i].f < this.openSet[winner].f){
                    winner = i;
                }
            }

            this.current = this.openSet[winner];
            if (this.current === this.end){
                console.log("found");
                this.p.noLoop();
            }
            removeFromArray(this.openSet, this.current);
            this.closedSet.push(this.current);

            var neighbours = this.current.neighbours;
            for (var m = 0; m < neighbours.length; m++){
                var neighbour = neighbours[m];
                if (neighbour){
                    if (!this.closedSet.includes(neighbour) && neighbour.isPassage != undefined && neighbour.isPassage){
                        var tempG = this.current.g + heuristic(neighbour, this.current, this.p);
                        var newPath = false;
                        if (this.openSet.includes(neighbour)){
                            if (tempG < neighbour.g){
                                neighbour.g = tempG;
                                newPath = true;
                            }
                        } else {
                            neighbour.g = tempG;
                            newPath = true
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

        }
        else {
            // no solution
        }
    this.drawPath()
    }

    drawPath(){
        for (var i = 0; i < this.cols; i++) {
            for (var j = 0; j < this.rows; j++) {
                if (this.grid[i][j].isPassage){
                    this.grid[i][j].showPath(this.p.color(255));
                }
                else{
                    this.grid[i][j].showPath(this.p.color(0));
                }
            }
        }

        for (var x = 0; x < this.openSet.length; x++){
            this.openSet[x].showPath(this.p.color(0,0,255,50));
        }

        for (var y = 0; y < this.closedSet.length; y++){
            this.closedSet[y].showPath(this.p.color(255,0,0,50));
        }

        this.start.showPath(this.p.color(255,0,0))
        this.end.showPath(this.p.color(0,255,0))

        // Find the path by working backwards
        this.path = []
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
            this.p.vertex(this.path[k].posx * this.w + this.w / 2, this.path[k].posy * this.h + this.h / 2);
        }
        this.p.endShape();
    }

}

export default Grid;