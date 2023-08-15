import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import React from "react";
import { useGlobalState } from "./Contexts";
import "./menu.css";
import { WALL_GENERATION_ALGO } from "./Constants";

function MazeAlgorithmButton() {
  const [state, dispatch] = useGlobalState();

  const dropdownState = {
    0: "maze-dropdown-invalid",
    1: "maze-dropdown-invalid",
    2: "maze-dropdown",
  };

  const maze_algorithm_options = {
    0: "Prim",
    1: "Kruskal",
  };

  let buttonState = {
    dropDownValue: "Select Maze Algorithm Type: ",
  };

  function handleSelect(e) {
    dispatch({ mazeAlgorithmType: e });
    buttonState["dropDownValue"] = e;
  }

  return (
    <DropdownButton
      data-bs-toggle="dropdown"
      variant="success"
      title={
        buttonState["dropDownValue"] +
        maze_algorithm_options[state.mazeAlgorithmType]
      }
      id="maze-algorithm-select"
      onSelect={handleSelect}
      className="dropdown"
    >
      <Dropdown.Header>Dropdown header</Dropdown.Header>
      <Dropdown.Item eventKey="0">{maze_algorithm_options[0]}</Dropdown.Item>
      <Dropdown.Item eventKey="1">{maze_algorithm_options[1]}</Dropdown.Item>
    </DropdownButton>
  );
}

export default MazeAlgorithmButton;
