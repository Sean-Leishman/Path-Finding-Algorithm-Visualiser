function removeFromArray(arr, val){
    for (var i = arr.length-1; i>=0; i--){
        if (arr[i] === val){
            arr.splice(i,1);
        }
    }
}

var doneDrawing = false;

function setup() {
    createCanvas(800,800);
    background(0);
    myGrid = new Grid();
    myGrid.drawDrawing();
}


function draw() {
    if (myGrid.frontier.length === 0){
        doneDrawing = true;
        myGrid.showPath();
    }
    else {
        myGrid.showDrawing();
    }
}

