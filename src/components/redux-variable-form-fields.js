import React, { PropTypes } from 'react';
import { passPropsToAllChildren } from 'utils/utils';

const ReduxVariableFormFields = props =>
  <div>
    { passPropsToAllChildren(props, ['onChange', 'data']) }
  </div>;

ReduxVariableFormFields.propTypes = {
  children: PropTypes.oneOf([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  onChange: PropTypes.func.isRequired,
  data: PropTypes.shape({}),
};

export default ReduxVariableFormFields;
