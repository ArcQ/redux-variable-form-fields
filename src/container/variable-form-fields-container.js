import React from 'react';
import PropTypes from 'prop-types';
import { passPropsToAllChildren } from 'utils/utils';

const addRow = function (row) {
  this.setState({
    addedRows: this.state.addedRows.concat([row]),
  });
};

class VariableFormFieldsContainer extends React.Component {
  constructor() {
    super();
    this.addRow = addRow.bind(this);
    this.state = {
      addedRows: [],
      addRow: this.addRow,
    };
  }
  render() {
    return (<div>
      {
        passPropsToAllChildren(
          {
            ...this.props,
            addedRows: this.state.addedRows,
            addRow: this.state.addRow,
          },
          [
            'onChange',
            'data',
            'addRow',
            'addedRows',
          ],
        )
      }
    </div>);
  }
}


VariableFormFieldsContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  onChange: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({})),
};

export default VariableFormFieldsContainer;
