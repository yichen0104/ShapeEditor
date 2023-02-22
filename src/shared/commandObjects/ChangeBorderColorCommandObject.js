import CommandObject from "./CommandObject";

export default class ChangeBorderColorCommandObject extends CommandObject {
  constructor(undoHandler) {
    super(undoHandler, true);
    this.targetObjectId = undefined;
  }

  /* override to execute the action of this command.
   * pass in false for addToUndoStack if this is a command which is NOT
   * put on the undo stack, like Copy, or a change of selection or Save
   */
  // original parameters: selectedObj, currBorderColor
  execute(selectedShapeId, shapesMap, currBorderColor) {
    /*
    if (this.state.selectedShapeId) {
      this.updateShape(this.state.selectedShapeId, { borderColor });
    }

    updateShape = (shapeId, newData) => {
      console.log("updateShape()");
      let shapesMap = { ...this.state.shapesMap };
      let targetShape = shapesMap[shapeId];
      shapesMap[shapeId] = { ...targetShape, ...newData };
      this.setState({ shapesMap });
      this.registerExecution();
    };
    */
    // let selectedObj = shapesMap[selectedShapeId]
    if (selectedShapeId !== null) {
      console.log("ChangeBorderColorCommandObject.execute()");
      this.targetObjectId = selectedShapeId; // global variable for selected
      this.oldValue = shapesMap[selectedShapeId].borderColor; // object's current color
      this.newValue = currBorderColor; // get the color widget's current color
      shapesMap[selectedShapeId].borderColor = this.newValue; // actually change

      // Note that this command object must be a NEW command object so it can be
      // registered to put it onto the stack
      if (this.addToUndoStack) this.undoHandler.registerExecution(this);
    }
  }

  /* override to undo the operation of this command
   */
  undo(state) {
    //this.targetObjectId.borderColor = this.oldValue;
    state.shapesMap[this.targetObjectId].borderColor = this.oldValue; // actually change
    // maybe also need to fix the palette to show this object's color?
  }

  /* override to redo the operation of this command, which means to
   * undo the undo. This should ONLY be called if the immediate
   * previous operation was an Undo of this command. Anything that
   * can be undone can be redone, so there is no need for a canRedo.
   */
  redo(state) {
    //this.targetObjectId.fillColor = this.newValue;
    state.shapesMap[this.targetObjectId].borderColor = this.newValue; // actually change
    // maybe also need to fix the palette to show this object's color?
  }

  /* override to return true if this operation can be repeated in the
   * current context
   */
  canRepeat() {
    //return selectedObj !== null;
    return false;
  }

  /* override to execute the operation again, this time possibly on
   * a new object. Thus, this typically uses the same value but a new
   * selectedObject.
   */
  repeat() {
    /*if (selectedObj !== null) {
      this.targetObjectId = selectedObj; // get new selected obj
      this.oldValue = selectedObj.fillColor; // object's current color
      // no change to newValue since reusing the same color
      selectedObj.fillColor = this.newValue; // actually change

      // Note that this command object must be a NEW command object so it can be
      // registered to put it onto the stack
      if (this.addToUndoStack) this.undoHandler.registerExecution({ ...this });
    }*/
  }
}
