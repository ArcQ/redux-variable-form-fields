export default function getFormData(data, formKey) {
  return data.reduxVariableFormFields[formKey] || [{}];
}
