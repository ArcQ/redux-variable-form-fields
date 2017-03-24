import { PropTypes } from 'react';
import ReduxVariableFormFields from 'components/redux-variable-form-fields';

const ReduxVariableFormFieldsContainer = props => (ReduxVariableFormFields(props));

ReduxVariableFormFieldsContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  formKey: PropTypes.string.isRequired,
  formDataOnChange: PropTypes.func.isRequired,
};

export default ReduxVariableFormFieldsContainer;
