import React, { PropTypes } from 'react';
import update from 'immutability-helper';

function makeVarInput(ele, row, createFieldInputHandler, fieldData) {
  const { varInput, ...restProps } = ele.props; // eslint-disable-line no-unused-vars
  // if no field.key, we just wont' track it, no err req
  // should probably use React.cloneElement()
  console.log('ele', ele);
  console.log('row', row);
  console.log('create', createFieldInputHandler);
  console.log('fieldData', fieldData);
  const input = update(ele,
    (ele.key)
    ? {
      props: {
        $set: {
          ...restProps,
          key: ele.key + row,
          value: (fieldData && fieldData.getIn([row, ele.key + row])) || '',
          onChange: createFieldInputHandler(row, ele.key + row),
        },
      },
    }
    : {});
  return input;
}

function makeVarRemove(ele) {

}

function linkIfVarInput(ele, row, createFieldInputHandler, fieldData, inputState) {
  if (ele && ele.props) {
    if (ele.props.varInput) {
      return makeVarInput(ele,row,createFieldInputHandler, fieldData, inputState);
    } else if (ele.props.varRemove) {
      return makeVarRemove(ele,row,createFieldInputHandler, fieldData, inputState);
    }
    return update(ele, {
      props: {
        children: {
          $set: React.Children.map(ele.props.children, child =>
            linkIfVarInput(child, row, createFieldInputHandler, fieldData, inputState)),
        },
      },
    });
  }
  return null;
}

const renderInputs = function (props) {
  const {
    inputList,
    createFieldInputHandler,
    children: fieldObj,
    fieldData,
  } = props;
  return inputList.map((inputState, row) => {
    if (fieldObj.constructor !== Array) {
      return linkIfVarInput(fieldObj, row, createFieldInputHandler, fieldData, inputState);
    }
    return fieldObj.map(field =>
      linkIfVarInput(field, row, createFieldInputHandler, fieldData, inputState));
  });
};

export const ReduxVariableFormFields = props =>
  <div> { renderInputs(props) } </div>;

ReduxVariableFormFields.propTypes = {
};

export default ReduxVariableFormFields;
