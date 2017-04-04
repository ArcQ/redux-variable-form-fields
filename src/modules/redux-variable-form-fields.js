import update from 'immutability-helper';

// ------------------------------------
// Constants
// ------------------------------------
export const MODIFY_VAR_FIELDS = 'MODIFY_VAR_FIELDS';

// ------------------------------------
// Actions
// ------------------------------------
function modifyVarFields(formKey, data) {
  return {
    type: MODIFY_VAR_FIELDS,
    formKey,
    data,
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
    [action.formKey]: { $set: action.data },
  }),
};

// ------------------------------------
// Selectors
// ------------------------------------


// ------------------------------------
// Reducer
// ------------------------------------

const initialState = {};

export default function reduxVariableFormFieldsReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
