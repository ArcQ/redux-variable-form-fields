import { PropTypes } from 'react';
import ReduxVariableFormFields from 'components/redux-variable-form-fields';

const ReduxVariableFormFieldsContainer = props => (ReduxVariableFormFields(props));

ReduxVariableFormFieldsContainer.propTypes = {
  children: PropTypes.oneOf([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  formKey: PropTypes.string.isRequired,
};

export default ReduxVariableFormFieldsContainer;
