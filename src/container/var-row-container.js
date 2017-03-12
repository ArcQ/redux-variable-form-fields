import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import update from 'immutability-helper';
import { getHandlerCreator } from 'utils/utils';
import VarRow from '../components/var-row';
import { actions, selectors } from '../modules/redux-variable-form-fields';

// dataObj refers to the obj/str that the input passes in
/*
  shapeArr is for incase the fieldData is actually nested in dataObj
  eg. if event.target.value = x then shapeArr = ['target', 'value']
      if event =x then shapeArr = undefined
      */
function fieldInputHandler([row, formData, fieldKey], shapeArr, dataObj) {
  const getNestedValFromKeyArr = (obj, keyArr, i) =>
    ((i < keyArr.length) ? getNestedValFromKeyArr(obj[keyArr[i]], keyArr, i + 1) : obj[keyArr[i]]);
  const fieldData = (shapeArr && shapeArr.length > 0)
    ? getNestedValFromKeyArr(dataObj, shapeArr)
    : dataObj;
  return update(formData, {
    [row]: {
      [fieldKey]: { $set: fieldData },
    },
  });
}

function removeRowHandler([row, formData]) {
  return update(formData, { $splice: [row, 0] });
  // formData.remove(row);
}

function getInitialFormData() {
  return [{}];
}

const VarRowContainer = (props) => {
  const { getFormDataHandler, ...rest } = props;
  const formData = getFormDataHandler(props.formKey) || getInitialFormData();
  return (<div>
    { VarRow({
      ...rest,
      formData,
      createFieldInputHandler: getHandlerCreator(props, fieldInputHandler),
      createRemoveRowHandler: getHandlerCreator(props, removeRowHandler),
    })
    }
  </div>);
};

const mapDispatchToProps = {
  modifyVarFields: actions.modifyVarFields,
};

const mapStateToProps = state => ({
  getFormDataHandler: selectors.getFormDataHandler(state),
});

VarRowContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.element,
  ]),
  shapeArr: PropTypes.arrayOf(PropTypes.string),
  formKey: PropTypes.string.isRequired,
  getFormDataHandler: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(VarRowContainer);
