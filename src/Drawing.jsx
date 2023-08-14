import Grid from "./Grid";
import Sketch from "react-p5";
import React, { Component } from "react";
import { useGlobalState } from "./Contexts";
import { WIDTH, HEIGHT } from "./Constants";

export default function Drawing() {
  let [state, dispatch] = useGlobalState();
  let generation = false;
  let walls_generated = false;
  let generated_walls = false;

  const canvasStyle = {
    marginTop: "1rem",
  };

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(WIDTH, HEIGHT).parent(canvasParentRef);
    p5.background(255);
    p5.myGrid = new Grid(p5);
    p5.myGrid.drawDrawing();
    p5.frameRate(120);
  };

  const draw = (p5) => {
    // Pre start state
    if (state.paused == 2) {
    }
    // resume state
    if ((state.previousPausedState === 3) & (state.paused === 0)) {
      //p5.clear();
      p5.myGrid.reset();
      p5.myGrid.drawDrawing();
      dispatch({ previousPausedState: 0 });
    }
    if (state.paused == 0) {
      if (!walls_generated && state.wallGenerationType == 0) {
        console.log("Generate walls");
        p5.myGrid.generate_all_walls();
        walls_generated = true;
      } else if (!walls_generated && state.wallGenerationType == 1) {
        console.log("Walls Generated");
        p5.myGrid.generate_all_walls_with_steps(2);
        walls_generated = true;
      }
      if (generation) {
        if (
          (p5.myGrid.frontier.length === 0 && state.wallGenerationType != 1) ||
          generated_walls
        ) {
          p5.myGrid.showAStarPath();
          if (p5.myGrid.finished) {
            dispatch({ paused: 3 });
          }
        } else {
          generated_walls = p5.myGrid.updateMazeStep(2);
          if (generated_walls) {
            console.log("Fully Generated");
            p5.myGrid.drawDrawing();
          }
        }
      } else if (state.wallGenerationType == 0) {
        p5.myGrid.drawDrawing();
        generation = true;
      } else {
        generation = true;
      }
    }
  };

  return <Sketch style={canvasStyle} setup={setup} draw={draw} />;
}
