import Grid from './Grid';
import Sketch from 'react-p5';
import React, { Component } from "react";
import { useGlobalState } from './Contexts';

export default function Drawing(){

    let [ state, dispatch ] = useGlobalState();
    let generation = false;

    const setup = (p5, canvasParentRef) => {
        p5.createCanvas(window.innerWidth,window.innerHeight).parent(canvasParentRef);
        p5.background(0);
        p5.myGrid = new Grid(p5);
        p5.myGrid.drawDrawing();
        p5.frameRate(120);
        p5.myGrid.generate_walls();
    }
    
    const draw = (p5) => {
        if (state.paused == 0){
            if (generation){
                if (p5.myGrid.frontier.length === 0){
                    let doneDrawing = true;
                    p5.myGrid.showPath();
                }
                else {
                    p5.myGrid.showDrawing();
                }
            }
            else{
                p5.myGrid.drawDrawing();
                generation = true;
            }
        }
        else{

        }
    }


    
    return (
        <Sketch setup={setup} draw={draw} />
        )
}