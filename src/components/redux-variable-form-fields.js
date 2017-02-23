import React, { PropTypes } from 'react';
import update from 'immutability-helper';

function linkIfVarInput(ele, row, inputState, createFieldInputHandler, fieldData) {
  if (ele && ele.props) {
    if (ele.props.varInput) {
      const { varInput, ...restProps } = ele.props; // eslint-disable-line no-unused-vars
      // if no field.key, we just wont' track it, no err req
      const f = update(ele,
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
      return f;
    }
    return update(ele, {
      props: {
        children: {
          $set: React.Children.map(ele.props.children, child =>
            linkIfVarInput(child, row, inputState, createFieldInputHandler, fieldData)),
        },
      },
    });
  }
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
      return linkIfVarInput(fieldObj, row, inputState, createFieldInputHandler, fieldData);
    }
    return fieldObj.map(field =>
      linkIfVarInput(field, row, inputState, createFieldInputHandler, fieldData));
  });
};

export const ReduxVariableFormFields = props =>
  <div> { renderInputs(props) } </div>;

ReduxVariableFormFields.propTypes = {
  isCalcResult: PropTypes.bool.isRequired,
};

export default ReduxVariableFormFields;
