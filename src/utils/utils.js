import React from 'react';
import update from 'immutability-helper';

// update from immutability helper but as a promise so that it can be chained
function chainedUpdate(...args) {
  return new Promise(resolve => resolve(update(...args)));
}

// get function that creates the custom handlers for each input + button
// props, handler are passed in on init

// at init, pass in props + handler to create callback for each child input/button
// aggregates rendertime + runtime args, passes into handler, then modifies store (modifyVarFields)
export function getHandlerCreator(props, handler) {
  const { onChange, data, shapeArr } = props;
  return (...renderArgs) => runtimeArg =>
    chainedUpdate(
      data,
      { $set: handler(renderArgs, shapeArr, runtimeArg) },
    ).then(newFormData => onChange(newFormData));
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

function getFilteredPropsByKeys(props, allowedKeysArr) {
  return Object.keys(props)
    .filter(key => allowedKeysArr.includes(key))
    .reduce((obj, key) => {
      obj[key] = props[key];
      return obj;
    }, {});
}

export function passPropsToAllChildren(props, allowedKeysArr) {
  const { children, ...restProps } = props; // eslint-disable-line no-unused-vars
  const passProps = (allowedKeysArr && allowedKeysArr.length > 0)
    ? getFilteredPropsByKeys(restProps, allowedKeysArr)
    : restProps;
  return React.Children.map(props.children, child =>
    React.cloneElement(child, passProps));
}

export default {};
