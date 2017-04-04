import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import update from 'immutability-helper';
import { getHandlerCreator, getInitialFormData } from 'utils/utils';
import VarLast from 'components/var-last';
import { actions, selectors } from 'modules/redux-variable-form-fields';

function createAddRowHandler(data) {
  return () => update(data, { $push: [{}] });
}

const VarLastContainer = (props) => {
  const { data, getFormDataHandler, ...rest } = props;
  return (<div>
    { VarLast({
      ...rest,
      addRowHandler: getHandlerCreator(props, createAddRowHandler(data))(),
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

VarLastContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.element,
  ]),
  data: PropTypes.shape({}).isRequired,
  getFormDataHandler: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(VarLastContainer);
