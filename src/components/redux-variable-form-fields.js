import React, { PropTypes } from 'react';
import { passPropsToAllChildren } from 'utils/utils';

export const ReduxVariableFormFields = props =>
  <div>
    {
      passPropsToAllChildren(props, ['formKey', 'formDataOnChange'])
    }
  </div>;

ReduxVariableFormFields.propTypes = {
  children: PropTypes.oneOf([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  formKey: PropTypes.string.isRequired,
};

export default ReduxVariableFormFields;
