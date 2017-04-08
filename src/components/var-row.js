import React, { PropTypes } from 'react';
import update from 'immutability-helper';
import { findEleWithPropAndModify } from 'utils/utils';

function getCreateVarInputHandler(createFieldInputHandler, data) {
  return row => (ele) => {
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

function getRenderRowF(data, createFieldInputHandler, createRemoveRowHandler, getClassNameStr) {
  return (field, row) => {
    const modifierArr = [
      {
        propKey: 'varInput',
        modifier: getCreateVarInputHandler(
          createFieldInputHandler,
          data)(row),
      },
      {
        propKey: 'varRemove',
        modifier: getCreateVarRemoveHandler(
          createRemoveRowHandler,
          data),
      },
    ];
    return (<div className={getClassNameStr(row)}>
      {
        findEleWithPropAndModify(field, row, modifierArr)
      }
    </div>);
  };
}

function getClassNamesStrF(rowName, animateFirst, pendingRemovalRows, addedRows) {
  return (row) => {
    let classNamesArr = [];
    const pendingRemovalIndex = pendingRemovalRows.indexOf(row);
    const addedIndex = addedRows.indexOf(row);
    switch (true) {
      case (pendingRemovalIndex !== -1):
        classNamesArr = ['-leave'];
        pendingRemovalRows.splice(pendingRemovalIndex, 1);
        break;
      case ((addedIndex !== -1) || (animateFirst && (row === 0))):
        classNamesArr = ['-enter'];
        addedRows.splice(addedIndex, 1);
        break;
      default:
        break;
    }
    return ['']
      .concat(classNamesArr)
      .map(suffix => rowName + suffix)
      .join(' ');
  };
}

function renderInputs(props) {
  const {
    createFieldInputHandler,
    createRemoveRowHandler,
    children: fieldObj,
    data,
    name,
    pendingRemovalRows,
    animateFirst,
    addedRows,
  } = props;

  const renderRow = getRenderRowF(
    data,
    createFieldInputHandler,
    createRemoveRowHandler,
    getClassNamesStrF(
      name,
      animateFirst,
      pendingRemovalRows,
      addedRows,
    ),
  );

  return data.map((inputState, row) => {
    if (fieldObj.constructor !== Array) {
      return renderRow(fieldObj, row);
    }
    return fieldObj.map(field =>
      renderRow(field, row),
    );
  });
}

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
  pendingRowRemoval: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default VarRow;
