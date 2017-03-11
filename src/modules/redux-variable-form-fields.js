import update from 'immutability-helper';
import Immutable from 'immutable';

// ------------------------------------
// Constants
// ------------------------------------
export const MODIFY_VAR_FIELDS = 'MODIFY_VAR_FIELDS';

// ------------------------------------
// Actions
// ------------------------------------
function modifyVarFields(formKey, formData) {
  return {
    type: MODIFY_VAR_FIELDS,
    formKey,
    formData,
  };
}

export const actions = {
  modifyVarFields,
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [MODIFY_VAR_FIELDS]: (state, action) => update(state, {
    [action.formKey]: { $set: action.formData },
  }),
};

// ------------------------------------
// Selectors
// ------------------------------------

export function getFormDataHandler(state) {
  return formKey => state.reduxVariableFormFields[formKey];
}

export const selectors = {
  getFormDataHandler,
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = {};

export default function reduxVariableFormFieldsReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
