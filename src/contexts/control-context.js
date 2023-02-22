import { createContext } from "react";

// create a context with default values
const controlContext = createContext({
  currMode: "",
  changeCurrMode: () => {},
  currBorderColor: "",
  changeCurrBorderColor: () => {},
  tempBorderWidth: 1,
  changeTempBorderWidth: () => {},
  currBorderWidth: 1,
  updateBorderWidth: () => {},
  changeCurrBorderWidth: () => {},
  currFillColor: "",
  changeCurrFillColor: () => {},

  shapes: [],
  shapesMap: {},
  addShape: () => {},
  moveShape: () => {},
  moveAndUpdateShape: () => {},
  selectedShapeId: "", // a string or undefined
  selectShape: () => {},
  deleteSelectedShape: () => {},

  undo: () => {},
  redo: () => {},

});

export default controlContext;
