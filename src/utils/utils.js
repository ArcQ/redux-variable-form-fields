import update from 'immutability-helper';
import React from 'react';

// get function that creates the custom handlers for each input + button
// props, handler are passed in on init

// at init, pass in props + handler to create callback for each child input/button
// aggregates rendertime + runtime args, passes into handler, then modifies store (modifyVarFields)
export function getHandlerCreator(props, handler) {
  const { formKey, shapeArr, modifyVarFields } = props;
  return (...renderArgs) => runtimeArg =>
    modifyVarFields(formKey, handler(renderArgs, shapeArr, runtimeArg));
}

/* given ele, recursively searches the ele and all children,
  for each that contain propKey, apply modifier
  eg of what modifierArr is: [{ propKey:'test' modifier:(ele) => returnNewEle }, ...]
*/
export function findEleWithPropAndModify(ele, row, modifierArr) {
  if (ele && ele.props) {
    /* if ele matches keys in modifierArr, then get newEle from cbObj.cb,
    else newEle will be old ele
    */
    const newEle = modifierArr.reduce(
      (a, b) => ((ele.props[b.propKey]) ? b.modifier(ele, row) : a)
      , ele);
    // if key not found, continue search, keep this ele unchanged
    return (ele.props.children)
      ? update(newEle, {
        props: {
          children: {
            $set: React.Children.map(ele.props.children, child =>
              findEleWithPropAndModify(child, row, modifierArr)),
          },
        },
      }) : newEle;
  }
  return undefined;
}

export function getInitialFormData() {
  return ([{}]);
}

export default { findEleWithPropAndModify, getHandlerCreator, getInitialFormData };
