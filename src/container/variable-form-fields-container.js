import React, { PropTypes } from 'react';
import { passPropsToAllChildren } from 'utils/utils';

const VariableFormFieldsContainer = props =>
  <div>
    { passPropsToAllChildren(props, ['onChange', 'data']) }
  </div>;


VariableFormFieldsContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  onChange: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({})),
};

export default VariableFormFieldsContainer;
