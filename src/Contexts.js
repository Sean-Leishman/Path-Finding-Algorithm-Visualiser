import React from 'react';

const defaultDrawingState = {
  paused: 2,
}
const DrawingStateContext = React.createContext(defaultDrawingState);
const DispatchStateContext = React.createContext(undefined);

export const useGlobalState = () => [
    React.useContext(DrawingStateContext),
    React.useContext(DispatchStateContext)
]

const DrawingStateProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(
    (state, newValue) => ({ ...state, ...newValue }),
    defaultDrawingState
  );
  return (
    <DrawingStateContext.Provider value={state}>
      <DispatchStateContext.Provider value={dispatch}>
        {children}
      </DispatchStateContext.Provider>
    </DrawingStateContext.Provider>
  );
  }

export default DrawingStateProvider;