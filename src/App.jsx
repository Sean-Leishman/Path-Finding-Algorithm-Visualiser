import "./App.css";
import Drawing from "./Drawing";
import PauseButton from "./PauseButton";
import WallGenerationButton from "./WallGenerationButton";
import DrawingStateProvider from "./Contexts";
import PathAlgorithmButton from "./PathAlgorithmButton";
import MazeAlgorithmButton from "./MazeTypeButton";

function App() {
  const canvasStyle = {
    marginTop: "100px",
  };

  return (
    <div className="App">
      <DrawingStateProvider>
        <Drawing />
        <PauseButton />
        <div className="buttons">
          <WallGenerationButton />
          <PathAlgorithmButton />
          <MazeAlgorithmButton />
        </div>
      </DrawingStateProvider>
    </div>
  );
}

export default App;
