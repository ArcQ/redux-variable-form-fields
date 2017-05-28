import PropTypes from 'prop-types';
import { findEleWithPropAndModify } from 'utils/utils';
import update from 'immutability-helper';

function getModifyVarInput(createFieldInputHandler, data) {
  return row => (ele) => {
    // remove varInput as it won't be natively compatible with the input element
    const { varInput, onChange, ...restProps } = ele.props; // eslint-disable-line no-unused-vars
    const key = ele.key;
    // if no field.key, we just wont' track it, no err req
    // should probably use React.cloneElement()
    return update(ele,
      (ele.key)
      ? {
        props: {
          $set: {
            ...restProps,
            value: (data && data[row][key]) || '',
            onChange: createFieldInputHandler(row, data, key, onChange),
          },
        },
      }
      : {});
  };
}

function getModifyVarRemove(createRemoveRowHandler, data) {
  return row => (ele) => {
    if (row === 0 && !ele.props.showFirstRow) return undefined;
    // remove varRemove and showFirst as it won't be natively compatible with the button element
    const {
      varRemove, // eslint-disable-line no-unused-vars
      showFirstRow, // eslint-disable-line no-unused-vars
      ...restProps
    } = ele.props;
    const input = update(ele,
      {
        props: {
          $set: {
            ...restProps,
            onClick: createRemoveRowHandler(row, data),
          },
        },
      });
    return input;
  };
}


function VarRow(props) {
  const modifierArr = [
    {
      propKey: 'varInput',
      modifier: getModifyVarInput(
        props.createFieldInputHandler,
        props.data,
      )(props.row),
    },
    {
      propKey: 'varRemove',
      modifier: getModifyVarRemove(
        props.createRemoveRowHandler,
        props.data,
      )(props.row),
    },
  ];

  if (props.children.constructor !== Array) {
    return findEleWithPropAndModify(props.children, modifierArr);
  }
  return props.children.map(field =>
    findEleWithPropAndModify(field, modifierArr),
  );
}

VarRow.propTypes = {
  modifierArr: PropTypes.arrayOf(PropTypes.shape({
    propKey: PropTypes.string,
    modifier: PropTypes.func,
  })),

  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
};

export default VarRow;
