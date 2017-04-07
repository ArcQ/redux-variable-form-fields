import React, { PropTypes } from 'react';
import update from 'immutability-helper';
import { findEleWithPropAndModify } from 'utils/utils';

function getCreateVarInputHandler(createFieldInputHandler, data) {
  return (ele, row) => {
    // remove varInput as it won't be natively compatible with the input element
    const { varInput, ...restProps } = ele.props; // eslint-disable-line no-unused-vars
    const key = ele.key;
    // if no field.key, we just wont' track it, no err req
    // should probably use React.cloneElement()
    return update(ele,
      (ele.key)
      ? {
        props: {
          $set: {
            ...restProps,
            value: (data && data[row][key]) || '',
            onChange: createFieldInputHandler(row, data, key),
          },
        },
      }
      : {});
  };
}

function getCreateVarRemoveHandler(createRemoveRowHandler, data) {
  return (ele, row) => {
    if (row === 0 && !ele.props.showFirstRow) return undefined;
    // remove varRemove and showFirst as it won't be natively compatible with the button element
    const {
      varRemove, // eslint-disable-line no-unused-vars
      showFirstRow, // eslint-disable-line no-unused-vars
      ...restProps
    } = ele.props;
    const input = update(ele,
      {
        props: {
          $set: {
            ...restProps,
            onClick: createRemoveRowHandler(row, data),
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
    data,
  } = props;
  const modifierArr = [
    { propKey: 'varInput', modifier: getCreateVarInputHandler(createFieldInputHandler, data) },
    { propKey: 'varRemove', modifier: getCreateVarRemoveHandler(createRemoveRowHandler, data) },
  ];

  return data.map((inputState, row) => {
    if (fieldObj.constructor !== Array) {
      return findEleWithPropAndModify(fieldObj, row, modifierArr);
    }
    return fieldObj.map(field =>
      findEleWithPropAndModify(field, row, modifierArr),
    );
  });
};

export const VarRow = props =>
  <div> { renderInputs(props) } </div>;

VarRow.propTypes = {
  createFieldInputHandler: PropTypes.func.isRequired,
  createRemoveRowHandler: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default VarRow;
