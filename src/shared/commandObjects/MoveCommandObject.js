import CommandObject from "./CommandObject";

export default class MoveCommandObject extends CommandObject {
  constructor(undoHandler) {
    super(undoHandler, true);
    this.targetObjectId = undefined;
  }

  /* override to execute the action of this command.
   * pass in false for addToUndoStack if this is a command which is NOT
   * put on the undo stack, like Copy, or a change of selection or Save
   */
  execute(selectedShapeId, shapesMap, newData) {
    /*
    if (this.state.selectedShapeId) {
      this.updateShape(this.state.selectedShapeId, newData);
    }
    */
    if (selectedShapeId !== null) {
      console.log("MoveCommandObject.execute()");
      this.targetObjectId = selectedShapeId; // global variable for selected
      this.oldValue = {
        initCoords: shapesMap[selectedShapeId].initCoords,
        finalCoords: shapesMap[selectedShapeId].finalCoords
      }; // object's current position
      this.newValue = newData; // get the color widget's current position
      //shapesMap[selectedShapeId].fillColor = this.newValue;
      // actually change
      shapesMap[selectedShapeId].initCoords = this.newValue.initCoords;
      shapesMap[selectedShapeId].finalCoords = this.newValue.finalCoords;

      // Note that this command object must be a NEW command object so it can be
      // registered to put it onto the stack
      if (this.addToUndoStack) this.undoHandler.registerExecution(this);
    }
  }

  /* override to undo the operation of this command
   */
  undo(state) {
    //state.shapesMap[this.targetObjectId].fillColor = this.oldValue; // actually change
    state.shapesMap[this.targetObjectId].initCoords = this.oldValue.initCoords;
    state.shapesMap[this.targetObjectId].finalCoords = this.oldValue.finalCoords;
    // maybe also need to fix the palette to show this object's color?
  }

  /* override to redo the operation of this command, which means to
   * undo the undo. This should ONLY be called if the immediate
   * previous operation was an Undo of this command. Anything that
   * can be undone can be redone, so there is no need for a canRedo.
   */
  redo(state) {
    //state.shapesMap[this.targetObjectId].fillColor = this.newValue; // actually change
    state.shapesMap[this.targetObjectId].initCoords = this.newValue.initCoords;
    state.shapesMap[this.targetObjectId].finalCoords = this.newValue.finalCoords;
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
      this.targetObject = selectedObj; // get new selected obj
      this.oldValue = selectedObj.fillColor; // object's current color
      // no change to newValue since reusing the same color
      selectedObj.fillColor = this.newValue; // actually change

      // Note that this command object must be a NEW command object so it can be
      // registered to put it onto the stack
      if (this.addToUndoStack) this.undoHandler.registerExecution({ ...this });
    }*/
  }
}
