import './App.css';
import Drawing from './Drawing';
import PauseButton from './PauseButton';
import DrawingStateProvider from './Contexts'

function App() {
  return (
    <div className="App">
      <DrawingStateProvider>
        <Drawing />
        <PauseButton />
      </DrawingStateProvider>
    </div>
  );
}

export default App;
