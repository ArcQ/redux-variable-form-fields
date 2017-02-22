import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import VarNumFields from '../components/var-num-fields';
import { actions, selectors } from '../modules/var-num-fields';

let inputList = Immutable.fromJS([{}]);

function getNestedValFromKeyArr(obj, keyArr, i) {
  const nestedObj = obj[keyArr[i]];
  if (i < keyArr.length) {
    return getNestedValFromKeyArr(nestedObj, keyArr, i + 1);
  }
  return nestedObj;
}

function fieldInputHandler([row, fieldKey], shapeArr, dataObj) {
  // dataObj refers to the obj/str that the input passes in
  /*
  shapeArr is for incase the fieldData is actually nested in dataObj
  eg. event.target.value > shapeArr = ['target', 'value']
  */
  let fieldData = dataObj;
  if (shapeArr && shapeArr.length > 0) {
    fieldData = getNestedValFromKeyArr(dataObj, shapeArr);
  }
  return inputList.setIn([row, fieldKey], fieldData);
}

function removeRowHandler(row) {
  inputList.remove(row);
}

function addRowHandler() {
  return () => {
    inputList.push(Immutable.Map.of({}));
  };
}
function getHandlerCreator(props, handler) {
  const { formKey, shapeArr } = props;
  return (...renderArgs) => (runtimeArg) => {
    inputList = handler(renderArgs, shapeArr, runtimeArg);
    console.log(inputList.toJS());
    props.modifyVarFields(formKey, inputList);
  };
}

const VarNumFieldsContainer = props => {
  const { getFieldDataHandler,  ...rest } = props;
  const fieldData = getFieldDataHandler(props.formKey);
  console.log('fieldData',fieldData);
  return (<div>
    { VarNumFields({
      inputList,
      ...rest,
      fieldData,
      createFieldInputHandler: getHandlerCreator(props, fieldInputHandler),
      createRemoveRowHandler: getHandlerCreator(props, removeRowHandler),
      createAddRowHandler: getHandlerCreator(props, addRowHandler),
    })
    }
  </div>);
};

const mapDispatchToProps = {
  modifyVarFields: actions.modifyVarFields,
};

const mapStateToProps = state => ({
  getFieldDataHandler: selectors.getFieldDataHandler(state),
  // percentageSuccess: selectors.getPercentageSuccess(state),
  // percentColor: selectors.getCalcPercentColor(state),
});

VarNumFieldsContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.element,
  ]),
  shapeArr: PropTypes.arrayOf(PropTypes.string),
  formKey: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(VarNumFieldsContainer);
