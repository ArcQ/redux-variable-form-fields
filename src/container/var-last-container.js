import React from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { getHandlerCreator } from 'utils/utils';
import VarLast from 'components/var-last';

function createAddRowHandler(data, addedRows, addRow) {
  return () => {
    addRow(data.length);
    return update(data, { $push: [{}] });
  };
}

const VarLastContainer = (props) => {
  const { data, addedRows, addRow, ...rest } = props;
  return (<div>
    { VarLast({
      ...rest,
      addRowHandler: getHandlerCreator(props, createAddRowHandler(data, addedRows, addRow))(),
    })
    }
  </div>);
};

VarLastContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.element,
  ]),
  data: PropTypes.arrayOf(PropTypes.shape({})),
  onChange: PropTypes.func,
  addedRows: PropTypes.arrayOf(PropTypes.number),
  addRow: PropTypes.func,
};

export default VarLastContainer;

