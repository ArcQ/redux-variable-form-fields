import React from 'react';
import { getHandlerCreator } from 'utils/utils';
import update from 'immutability-helper';
import VarRow from '../components/var-row';

// dataObj refers to the obj/str that the input passes in
/*
  shapeArr is for incase the fieldData is actually nested in dataObj
  eg. if event.target.value = x then shapeArr = ['target', 'value']
      if event =x then shapeArr = undefined
      */
function fieldInputHandler([row, data, fieldKey], shapeArr, dataObj) {
  const getNestedValFromKeyArr = (obj, keyArr, i) =>
    ((i < keyArr.length) ? getNestedValFromKeyArr(obj[keyArr[i]], keyArr, i + 1) : obj[keyArr[i]]);
  const fieldData = (shapeArr && shapeArr.length > 0)
    ? getNestedValFromKeyArr(dataObj, shapeArr)
    : dataObj;
  return update(data, {
    [row]: {
      [fieldKey]: { $set: fieldData },
    },
  });
}

function addRemoveAnimationClass(row) {
  this.setState({
    pendingRemovalRows: this.state.pendingRemovalRows.concat([row]),
  });
  return new Promise((resolve) => {
    setTimeout(
      () => {
        this.setState({
          pendingRemovalRows: this.state.pendingRemovalRows.filter(e => e !== row),
        });
        resolve();
      },
      this.props.transitionLeaveTimeout || 0,
    );
  });
}

const removeRowHandler = function ([row, data]) {
  return addRemoveAnimationClass.call(this, row).then(
    () => update(data, { $splice: [[row, 1]] }),
  );
};

class VarRowContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      pendingRemovalRows: [],
    };
    this.removeRowHandler = removeRowHandler.bind(this);
  }
  render() {
    return (<div>
      {
        VarRow({
          pendingRemovalRows: this.state.pendingRemovalRows,
          ...this.props,
          createFieldInputHandler: getHandlerCreator(this.props, fieldInputHandler),
          createRemoveRowHandler: getHandlerCreator(
            this.props,
            this.removeRowHandler,
          ),
        })
      }
    </div>);
  }
}

export default VarRowContainer;
