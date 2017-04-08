import React, { PropTypes } from 'react';
import update from 'immutability-helper';
import VarRow from './var-row';

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
  const getClassNameStr = getClassNamesStrF(
    props.name,
    props.animateFirst,
    props.pendingRemovalRows,
    props.addedRows,
  );

  return props.data.map((inputState, row) =>
    (<div key={`${name}row${row}`} className={getClassNameStr(row)}>
      <VarRow
        row={row}
        data={props.data}
        createFieldInputHandler={props.createFieldInputHandler}
        createRemoveRowHandler={props.createRemoveRowHandler}
      >
        { props.children }
      </VarRow>
    </div>),
  );
}

export const VarRows = function (props) {
  return <div> { renderInputs(props) } </div>;
};

VarRows.propTypes = {
  createFieldInputHandler: PropTypes.func.isRequired,
  createRemoveRowHandler: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  pendingRowRemoval: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default VarRows;
