import React, { Component, useEffect } from "react";

import ControlPanel from "./containers/ControlPanel/ControlPanel";
import Workspace from "./containers/Workspace/Workspace";

import ControlContext from "./contexts/control-context";
import { genId, defaultValues } from "./shared/util";

import "./App.css";
//import ChangeFillColorCommandObject from "./shared/commandObjects/ChangeFillColorCommandObject";
import AddShapeCommandObject from "./shared/commandObjects/AddShapeCommandObject";
import DeleteShapeCommandObject from "./shared/commandObjects/DeleteShapeCommandObject";
import ChangeBorderColorCommandObject from "./shared/commandObjects/ChangeBorderColorCommandObject";
import ChangeFillColorCommandObject from "./shared/commandObjects/ChangeFillColorCommandObject";
import ChangeBorderWidthCommandObject from "./shared/commandObjects/ChangeBorderWidthCommandObject";
// import MoveCommandObject from "./shared/commandObjects/MoveCommandObject";

class App extends Component {
  state = {
    // controls
    currMode: defaultValues.mode,
    currBorderColor: defaultValues.borderColor,
    currBorderWidth: defaultValues.borderWidth,
    borderWidthBeforeChange: 1,
    currFillColor: defaultValues.fillColor,

    // workspace
    shapes: [],
    shapesMap: {},
    selectedShapeId: undefined,
    selectedShapePosition: undefined,

    // handling undo/redo
    commandList: [],
    currCommand: -1,
  };

  constructor() {
    super();

    /*
     * pass this undoHandler into command object constructors:
     *  e.g. let cmdObj = new ChangeFillColorCommandObject(this.undoHandler);
     */
    this.undoHandler = {
      registerExecution: this.registerExecution,
      // TODO: fill this up with whatever you need for the command objects
    };

  }


  /*
   * TODO:
   * add the commandObj to the commandList so
   * that is available for undoing.
   */
  registerExecution = (commandObject) => {
    console.log("registerExecution()");
    let commands = [...this.state.commandList];
    let cmdPtr = this.state.currCommand;
    if(commands.length !== cmdPtr + 1){
      console.log('discard previous undo operations')
      commands = commands.slice(0, cmdPtr + 1);
      // disable redo
      document.getElementById("redoBtn").disabled = true;
    }
    cmdPtr++;
    commands.push(commandObject);
    this.setState({commandList: commands, currCommand: cmdPtr});
  };

  /*
   * TODO:
   * actually call the undo method of the command at
   * the current position in the undo stack
   */
  undo = () => {
    console.log("undo");
    // set to select mode
    this.setState({ currMode: "select" });
    
    // enable redoBtn if start undoing from last step
    if(this.state.currCommand + 1 === this.state.commandList.length){
      //console.log("redoBtn, I command you under our contract, release!")
      document.getElementById("redoBtn").disabled = false;
    }

    // disable undoBtn if currCommand about to be -1
    if(this.state.currCommand - 1 === -1){
      console.log("stop");
      document.getElementById("undoBtn").disabled = true;
    }
    // execute undo and setState(commandList, currCommand) accordingly
    let commands = this.state.commandList;
    let cmdPtr = this.state.currCommand;
    console.log(commands[cmdPtr]);
    //console.log(cmdPtr);
    commands[cmdPtr].undo(this.state);
    cmdPtr--;
    this.setState({
      commandList: commands,
      currCommand: cmdPtr
    });
    //this.state.commandList[this.state.currCommand].undo(this.state);
    //this.state.shapesMap[this.state.selectedShapeId].visible = false;
  };

  /*
   * TODO:
   * actually call the redo method of the command at
   * the current position in the undo stack. Note that this is
   * NOT the same command as would be affected by a doUndo()
   */
  redo = () => {
    console.log("redo");
    // set to select mode
    this.setState({ currMode: "select" });
    // enable undoBtn if start redoing from first step
    if(this.state.currCommand === -1){
      //console.log("undoBtn, I command you under our contract, release!")
      document.getElementById("undoBtn").disabled = false;
    }

    // disable redoBtn if
    if(this.state.currCommand + 2 === this.state.commandList.length){
      //console.log("yada mou yada, muri mou muri");
      document.getElementById("redoBtn").disabled = true;
    }

    // execute redo and setState(commandList, currCommand) accordingly
    let commands = this.state.commandList;
    let cmdPtr = this.state.currCommand;
    cmdPtr++;
    commands[cmdPtr].redo(this.state);
    this.setState({
      commandList: commands,
      currCommand: cmdPtr
    });
    console.log(this.state.currCommand);
    
  };

  // add the shapeId to the array, and the shape itself to the map
  addShape = (shapeData) => {
    console.log("addShape()");
    // add shape commands, put in execute()
    /*let shapes = [...this.state.shapes];
    let shapesMap = { ...this.state.shapesMap };
    const id = genId();
    shapesMap[id] = {
      ...shapeData,
      id,
    };
    shapes.push(id);
    this.setState({ shapes, shapesMap, selectedShapeId: id });*/
    // add commandobject
    let cmdObj = new AddShapeCommandObject(this.undoHandler);
    const id = genId();
    let shapes = [...this.state.shapes];
    let shapesMap = { ...this.state.shapesMap };
    cmdObj.execute(id, shapes, shapesMap, shapeData);
    this.setState({ shapes, shapesMap, selectedShapeId: id });
    //this.setState({commandList: cmds, currCommand: this.state.currCommand + 1});
    //this.registerExecution(cmdObj);
    // TODO: pass states instead of object
    //cmdObj.undo();
  };

  // get the shape by its id, and update its properties
  updateShape = (shapeId, newData) => {
    console.log("updateShape()");
    console.log(newData);
    let shapesMap = { ...this.state.shapesMap };
    let targetShape = shapesMap[shapeId];
    shapesMap[shapeId] = { ...targetShape, ...newData };
    this.setState({ shapesMap });
    //this.registerExecution();
  };

  moveShape = (newData) => {
    console.log(newData);
    if (this.state.selectedShapeId) {
      this.updateShape(this.state.selectedShapeId, newData);
    }
    /*let cmdObj = new MoveCommandObject(this.undoHandler);
    let selectedShapeId = this.state.selectedShapeId;
    let shapesMap = { ...this.state.shapesMap };
    //let currBorderColor = this.state.currBorderColor;
    //console.log(currBorderColor);
    cmdObj.execute(selectedShapeId, shapesMap, newData);
    //this.setState({ shapesMap });
    this.setState({
      selectedShapeId,
      shapesMap
    });*/

    //console.log("moveShape()");
  };

  moveAndUpdateShape = (newData) => {
    console.log('fdshjkfdshkjfds');
    /*let cmdObj = new MoveCommandObject(this.undoHandler);
    let selectedShapeId = this.state.selectedShapeId;
    let shapesMap = { ...this.state.shapesMap };
    //let currBorderColor = this.state.currBorderColor;
    //console.log(currBorderColor);
    cmdObj.execute(selectedShapeId, shapesMap, newData);
    //this.setState({ shapesMap });
    this.setState({
      selectedShapeId,
      shapesMap
    });*/
  }

  // deleting a shape sets its visibility to false, rather than removing it
  deleteSelectedShape = () => {
    console.log("deleteSelectedShape()");
    /*let shapesMap = { ...this.state.shapesMap };
    shapesMap[this.state.selectedShapeId].visible = false;
    this.setState({ shapesMap, selectedShapeId: undefined });
    this.registerExecution();*/

    // add commandobject
    let cmdObj = new DeleteShapeCommandObject(this.undoHandler);

    //const id = genId();
    // id, shapesMap, selectedShapeId
    let shapesMap = { ...this.state.shapesMap };
    cmdObj.execute(shapesMap, this.state.selectedShapeId);
    this.setState({ shapesMap, selectedShapeId: undefined });
    //this.registerExecution(cmdObj);
    //this.setState({commandList: cmds, currCommand: this.state.currCommand + 1});
    //this.registerExecution(cmdObj);
  };

  changeCurrMode = (mode) => {
    if (mode === "line") {
      this.setState({
        currMode: mode,
        currBorderColor: defaultValues.borderColor,
      });
    } else {
      this.setState({ currMode: mode });
    }
  };

  changeCurrBorderColor = (borderColor) => {
    this.setState({ currBorderColor: borderColor });

    // original
    /*if (this.state.selectedShapeId) {
      this.updateShape(this.state.selectedShapeId, { borderColor });
    }
    
    */
    // create ChangeBorderColorCommandObject
    let cmdObj = new ChangeBorderColorCommandObject(this.undoHandler);
    let selectedShapeId = this.state.selectedShapeId;
    let shapesMap = { ...this.state.shapesMap };
    //let currBorderColor = this.state.currBorderColor;
    //console.log(currBorderColor);
    cmdObj.execute(selectedShapeId, shapesMap, borderColor);
    //this.setState({ shapesMap });
    this.setState({
      selectedShapeId,
      shapesMap
    });
    
  };

  changeTempBorderWidth = (borderWidth) => {
    this.setState({
      borderWidthBeforeChange: borderWidth
    });
  }

  changeCurrBorderWidth = (borderWidth) => {
    this.setState({ currBorderWidth: borderWidth });
    // original
    /*if (this.state.selectedShapeId) {
      this.updateShape(this.state.selectedShapeId, { borderWidth });
    }*/

    let cmdObj = new ChangeBorderWidthCommandObject(this.undoHandler);
    let selectedShapeId = this.state.selectedShapeId;
    let shapesMap = { ...this.state.shapesMap };
    cmdObj.execute(selectedShapeId, shapesMap, borderWidth, this.state.borderWidthBeforeChange);
    this.setState({
      selectedShapeId,
      shapesMap
    });

  };

  updateBorderWidth = (borderWidth) => {
    // only update state.currBorderWidth
    this.setState({ currBorderWidth: borderWidth }); // must use or bar will not move

    if (this.state.selectedShapeId) {
      this.updateShape(this.state.selectedShapeId, { borderWidth });
    }
  }

  changeCurrFillColor = (fillColor) => {
    this.setState({ currFillColor: fillColor });
    /*if (this.state.selectedShapeId) {
      this.updateShape(this.state.selectedShapeId, { fillColor });
    }*/
    let cmdObj = new ChangeFillColorCommandObject(this.undoHandler);
    let selectedShapeId = this.state.selectedShapeId;
    let shapesMap = { ...this.state.shapesMap };
    //let currBorderColor = this.state.currBorderColor;
    //console.log(currBorderColor);
    cmdObj.execute(selectedShapeId, shapesMap, fillColor);
    this.setState({
      selectedShapeId,
      shapesMap
    });
  };


  render() {
    const {
      currMode,
      currBorderColor,
      currBorderWidth,
      currFillColor,
      shapes,
      shapesMap,
      selectedShapeId,
    } = this.state;

    // update the context with the functions and values defined above and from state
    // and pass it to the structure below it (control panel and workspace)
    return (
      <React.Fragment>
        <ControlContext.Provider
          value={{
            currMode,
            changeCurrMode: this.changeCurrMode,
            currBorderColor,
            changeCurrBorderColor: this.changeCurrBorderColor,
            currBorderWidth,
            changeTempBorderWidth: this.changeTempBorderWidth,
            updateBorderWidth: this.updateBorderWidth,
            changeCurrBorderWidth: this.changeCurrBorderWidth,
            currFillColor,
            changeCurrFillColor: this.changeCurrFillColor,

            shapes,
            shapesMap,
            addShape: this.addShape,
            moveShape: this.moveShape,
            moveAndUpdateShape: this.moveAndUpdateShape,
            selectedShapeId,
            selectShape: (id) => {
              this.setState({ selectedShapeId: id });
              if (id) {
                /** Change border color, with, fill color */
                const { borderColor, borderWidth, fillColor } = shapesMap[
                  shapes.filter((shapeId) => shapeId === id)[0]
                ];
                this.setState({
                  currBorderColor: borderColor,
                  currBorderWidth: borderWidth,
                  currFillColor: fillColor,
                });
              }
            },
            deleteSelectedShape: this.deleteSelectedShape,

            undo: this.undo,
            redo: this.redo,
          }}
        >
          <ControlPanel />
          <Workspace />
        </ControlContext.Provider>
      </React.Fragment>
    );
  }
}

export default App;
