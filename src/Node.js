class Node{
    constructor(p,x,y,w,h,isPassage,parent = undefined) {
        this.f = 0;
        this.g = 0;
        this.h = 0;

        this.w = w;
        this.b = h;

        this.posx = x;
        this.posy = y;

        this.isPassage = isPassage;

        this.isChecked = false;

        this.isFrontier = false;

        this.start = false;
        this.end = false;

        this.sons = [];

        this.parent = parent;

        this.obstacle = !isPassage;

        this.neighbours = [];

        this.p = p
    }

    showMaze(col){
        if (this.isPassage){
            this.p.fill(255,255,255)
        }
        else {
            this.p.fill(0,0,0,50);
        }
        if (this.isFrontier){
            this.p.fill(0,0,255,50)
        }
        if (this.start){
            this.p.fill(255,0,0,50)
        }
        if (this.end){
            this.p.fill(0,255,0,50)
        }
        this.p.noStroke();
        this.p.rect(this.posx * this.w , this.posy * this.b, this.w , this.b, 55 );
    }

    showPath(col){
        this.p.noStroke();
        this.p.fill(col)
        this.p.rect(this.posx * this.w , this.posy * this.b, this.w , this.b, 55);
    }
}

export default Node;
