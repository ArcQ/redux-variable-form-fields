import React, { PropTypes } from 'react';
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

function removeRowHandler([row, data]) {
  return update(data, { $splice: [[row, 1]] });
}

const VarRowContainer = props => (<div>
  {
    VarRow({
      ...props,
      createFieldInputHandler: getHandlerCreator(props, fieldInputHandler),
      createRemoveRowHandler: getHandlerCreator(props, removeRowHandler),
    })
  }
</div>);

VarRowContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.element,
  ]),
  shapeArr: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  data: PropTypes.arrayOf(PropTypes.shape({})),
};

export default VarRowContainer;
