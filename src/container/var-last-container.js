import React, { PropTypes } from 'react';
import update from 'immutability-helper';
import { getHandlerCreator } from 'utils/utils';
import VarLast from 'components/var-last';

function createAddRowHandler(data) {
  return () => update(data, { $push: [{}] });
}

const VarLastContainer = (props) => {
  const { data, ...rest } = props;
  return (<div>
    { VarLast({
      ...rest,
      addRowHandler: getHandlerCreator(props, createAddRowHandler(data))(),
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
};

export default VarLastContainer;

