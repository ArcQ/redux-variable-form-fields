import React, { PropTypes } from 'react';
import update from 'immutability-helper';
import { findEleWithPropAndModify } from 'utils/utils';

function getCreateVarInputHandler(createFieldInputHandler, formData) {
  return (ele, row) => {
    // remove varInput as it won't be natively compatible with the input element
    const { varInput, ...restProps } = ele.props; // eslint-disable-line no-unused-vars
    const key = `${ele.key}${row}`;
    // if no field.key, we just wont' track it, no err req
    // should probably use React.cloneElement()
    return update(ele,
      (ele.key)
      ? {
        props: {
          $set: {
            ...restProps,
            key,
            value: (formData && formData[row][key]) || '',
            onChange: createFieldInputHandler(row, formData, key),
          },
        },
      }
      : {});
  };
}

function getCreateVarRemoveHandler(createRemoveRowHandler) {
  return (ele, row) => {
    // remove varRemove as it won't be natively compatible with the button element
    const { varRemove, ...restProps } = ele.props; // eslint-disable-line no-unused-vars
    const input = update(ele,
      {
        props: {
          $set: {
            ...restProps,
            onClick: createRemoveRowHandler(row),
          },
        },
      });
    return input;
  };
}

const renderInputs = function (props) {
  const {
    createFieldInputHandler,
    createRemoveRowHandler,
    children: fieldObj,
    formData,
  } = props;
  const modifierArr = [
    { propKey: 'varInput', modifier: getCreateVarInputHandler(createFieldInputHandler, formData) },
    { propKey: 'varRemove', modifier: getCreateVarRemoveHandler(createRemoveRowHandler) },
  ];

  return formData.map((inputState, row) => {
    if (fieldObj.constructor !== Array) {
      return findEleWithPropAndModify(fieldObj, row, modifierArr);
    }
    return fieldObj.map(field =>
      findEleWithPropAndModify(field, row, modifierArr),
    );
  });
};

export const ReduxVariableFormFields = props =>
  <div> { renderInputs(props) } </div>;

ReduxVariableFormFields.propTypes = {
};

export default ReduxVariableFormFields;
