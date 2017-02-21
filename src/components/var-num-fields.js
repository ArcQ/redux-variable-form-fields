import React, { PropTypes } from 'react';
import update from 'immutability-helper';

function linkIfVarNumField(ele, row, inputState, createFieldInputHandler, fieldData) {
  if (ele && ele.props) {
    if (ele.props.varNumField) {
      const { varNumField, ...restProps } = ele.props; // eslint-disable-line no-unused-vars
      // if no field.key, we just wont' track it, no err req
      const f = update(ele,
        (ele.key)
        ? {
          props: {
            $set: {
              ...restProps,
              key: ele.key + row,
              value: (fieldData && fieldData.getIn([row, ele.key + row])) || '',
              onChange: createFieldInputHandler(row, ele.key + row),
            },
          },
        }
        : {});
      return f;
    }
    return React.Children.map(ele.props.children, child =>
      linkIfVarNumField(child, row, inputState, createFieldInputHandler, fieldData),
    )
  }
}

const renderInputs = function (props) {
  const {
    inputList,
    createFieldInputHandler,
    children: fieldsArr,
    fieldData
  } = props;
  console.log('fieldData',fieldData);
  return inputList.map((inputState, row) =>
    // fieldsArr.map(field => {
    //   // if no field.key, we just wont' track it, no err req
    //   const x = update(field,
    //     (field.key)
    //     ? {
    //       props: {
    //         value: { $set: inputState.get(field.key) },
    //         onChange: { $set: createFieldInputHandler(row, field.key) },
    //       },
    //     }
    //     : {});
    //   return x;
    // }
    // ),
    fieldsArr.map(field => linkIfVarNumField(field, row, inputState, createFieldInputHandler, fieldData))
  );
};

export const VarNumFields = props => {
  return (<div>
    {renderInputs(props)}
  </div>
  )};

VarNumFields.propTypes = {
  isCalcResult: PropTypes.bool.isRequired,
};

export default VarNumFields;
