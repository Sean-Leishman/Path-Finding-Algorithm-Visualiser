import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import React from "react";
import { useGlobalState } from "./Contexts";
import "./menu.css";

const path_algorithm_ref = {
  AStar: 0,
};

function PathAlgorithmButton() {
  const [state, dispatch] = useGlobalState();

  const dropdownState = {
    0: "path-dropdown-invalid",
    1: "path-dropdown-invalid",
    2: "path-dropdown",
  };

  const path_algorithm_options = {
    0: "AStar",
  };

  let buttonState = {
    dropDownValue: "Select Path Algorithm Type: ",
  };

  function handleSelect(e) {
    dispatch({ pathAlgorithmType: path_algorithm_ref[e] });
    buttonState["dropDownValue"] = e;
  }

  return (
    <DropdownButton
      data-bs-toggle="dropdown"
      variant="success"
      title={
        buttonState["dropDownValue"] +
        path_algorithm_options[state.pathAlgorithmType]
      }
      id="path-algorithm-select"
      onSelect={handleSelect}
      className="dropdown"
    >
      <Dropdown.Header>Dropdown header</Dropdown.Header>
      <Dropdown.Item eventKey="AStar">
        {path_algorithm_options[0]}
      </Dropdown.Item>
    </DropdownButton>
  );
}

export default PathAlgorithmButton;
