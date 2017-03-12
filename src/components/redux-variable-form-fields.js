import React, { PropTypes } from 'react';

export const ReduxVariableFormFields = props =>
  <div>
    {
      React.Children.map(props.children, child =>
        React.cloneElement(child, { formKey: props.formKey }))
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
