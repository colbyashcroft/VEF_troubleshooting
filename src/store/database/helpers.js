const moveHelper = (ordersToMove, moveLocation, ArrayToReSort) => {
  //initalize things we will need
  const minSelected = Math.min(...ordersToMove);
  const maxSelected = Math.min(...ordersToMove);
  const movingObjectLength = ordersToMove.length;

  //determine how much to move the each selected item by
  let moveItemsBy = 0;
  let moveDirection = null;
  if (moveLocation < minSelected) {
    moveItemsBy = moveLocation - minSelected;
    moveDirection = 'up';
  } else if (moveLocation > maxSelected) {
    moveItemsBy = moveLocation - maxSelected;
    moveDirection = 'down';
  }

  //  Check if we are at the top or bottom of list
  if (
    (minSelected == 0 && moveDirection == 'up') ||
    (maxSelected == ArrayToReSort.length - 1 && moveDirection == 'down')
  ) {
    throw 'error, you cannot move an item below order 0 or order that is greater than the array.length -1';
  }

  // console.log('moveItemsBy', moveItemsBy);

  //queue my updates
  const moveUpdate = {};
  ArrayToReSort.forEach(item => {
    //if it is one of the ones that is in the selected userInputs then move it by move items by
    if (ordersToMove.includes(item.order)) {
      moveUpdate[item.id] = {
        order: item.order + moveItemsBy
      };
      //if it is moving up the list and it falls between it's current position and it's new position move it up by length of ordersToMove
    } else if (moveDirection === 'up' && item.order < minSelected && item.order >= moveLocation) {
      moveUpdate[item.id] = {
        order: item.order + movingObjectLength
      };
      //if it is moving down the list and it falls between it's current position and it's new position move it up by length of ordersToMove
    } else if (moveDirection === 'down' && item.order > maxSelected && item.order <= moveLocation) {
      moveUpdate[item.id] = {
        order: item.order - movingObjectLength
      };
    }
  });

  return moveUpdate;
};

const helpers = {
  moveHelper
};

export default helpers;
