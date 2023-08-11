import Grid from "./Grid";
import Sketch from "react-p5";
import React, { Component } from "react";
import { useGlobalState } from "./Contexts";
import { WIDTH, HEIGHT } from "./Constants";

export default function Drawing() {
  let [state, dispatch] = useGlobalState();
  let generation = false;
  let walls_generated = false;

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
      }
      if (generation) {
        if (p5.myGrid.frontier.length === 0) {
          p5.myGrid.showAStarPath();
          if (p5.myGrid.finished) {
            dispatch({ paused: 3 });
          }
        } else {
          p5.myGrid.updateMazeStep();
        }
      } else {
        p5.myGrid.drawDrawing();
        generation = true;
      }
    }
  };

  return <Sketch style={canvasStyle} setup={setup} draw={draw} />;
}
