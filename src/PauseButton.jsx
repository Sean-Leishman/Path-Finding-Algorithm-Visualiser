import Button from 'react-bootstrap/Button';
import React from 'react';
import { useGlobalState } from './Contexts';

const paused_reference = {
  0: "Pause",
  1: "Resume",
  2: "Start",
  3: "Restart",
}

function PauseButton() {
    const [ state, dispatch ] = useGlobalState();

    function handlePause(e) {
      e.preventDefault();
      dispatch({previousPausedState:state.paused})
      if (state.paused == 2 | state.paused == 3){
        state.paused = 1;
      }
      dispatch({paused:Math.abs(state.paused - 1)})
      console.log(state.paused)
    }
  
    return (
        <Button variant="outlined" onClick={handlePause}>{paused_reference[state.paused]}</Button>
    );
  }

export default PauseButton