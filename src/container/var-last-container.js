import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import update from 'immutability-helper';
import { getHandlerCreator, getInitialFormData } from 'utils/utils';
import VarLast from 'components/var-last';
import { actions, selectors } from 'modules/redux-variable-form-fields';

function createAddRowHandler(formData) {
  return () => update(formData, { $push: [{}] });
}

const VarLastContainer = (props) => {
  const { getFormDataHandler, ...rest } = props;
  const formData = getFormDataHandler(props.formKey) || getInitialFormData();
  return (<div>
    { VarLast({
      ...rest,
      addRowHandler: getHandlerCreator(props, createAddRowHandler(formData))(),
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
  formKey: PropTypes.string.isRequired,
  getFormDataHandler: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(VarLastContainer);
