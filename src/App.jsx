import "./App.css";
import Drawing from "./Drawing";
import PauseButton from "./PauseButton";
import WallGenerationButton from "./WallGenerationButton";
import DrawingStateProvider from "./Contexts";
import PathAlgorithmButton from "./PathAlgorithmButton";

function App() {
  const canvasStyle = {
    marginTop: "100px",
  };

  return (
    <div className="App">
      <DrawingStateProvider>
        <Drawing />
        <PauseButton />
        <WallGenerationButton />
        <PathAlgorithmButton />
      </DrawingStateProvider>
    </div>
  );
}

export default App;
