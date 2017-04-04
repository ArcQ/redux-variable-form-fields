import React, { PropTypes } from 'react';
import ReduxVariableFormFields from 'components/redux-variable-form-fields';
import { passPropsToAllChildren } from 'utils/utils';

const ReduxVariableFormFieldsContainer = props =>
  <div>
    { passPropsToAllChildren(props, ['onChange', 'data']) }
  </div>;


ReduxVariableFormFieldsContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  onChange: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({})),
};

export default ReduxVariableFormFieldsContainer;
