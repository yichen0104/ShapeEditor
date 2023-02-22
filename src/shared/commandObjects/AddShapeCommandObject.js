import CommandObject from "./CommandObject";
//import controlContext from "./contexts/control-context";

export default class AddShapeCommandObject extends CommandObject {
  constructor(undoHandler) {
    super(undoHandler, true);
    this.targetObject = undefined;
  }

  /* override to execute the action of this command.
   * pass in false for addToUndoStack if this is a command which is NOT
   * put on the undo stack, like Copy, or a change of selection or Save
   */
  execute(id, shapes, shapesMap, shapeData) {
    console.log("AddShapeCommandObject.execute()");
    
    shapesMap[id] = {
      ...shapeData,
      id,
    };
    shapes.push(id);
    this.targetObject = id;

    // Note that this command object must be a NEW command object so it can be
    // registered to put it onto the stack
    if (this.addToUndoStack) this.undoHandler.registerExecution(this);
  }

  /* override to undo the operation of this command
   */
  undo(state) {
    state.selectedShapeId = undefined;
    state.shapesMap[this.targetObject].visible = false;
  }

  /* override to redo the operation of this command, which means to
   * undo the undo. This should ONLY be called if the immediate
   * previous operation was an Undo of this command. Anything that
   * can be undone can be redone, so there is no need for a canRedo.
   */
  redo(state) {
    // maybe also need to fix the palette to show this object's color?
    state.selectedShapeId = this.targetObject;
    state.shapesMap[this.targetObject].visible = true;
  }

  /* override to return true if this operation can be repeated in the
   * current context
   */
  canRepeat() {
    return false;
  }

  /* override to execute the operation again, this time possibly on
   * a new object. Thus, this typically uses the same value but a new
   * selectedObject.
   */
  repeat() {
    console.log('xxx');
  }
}
