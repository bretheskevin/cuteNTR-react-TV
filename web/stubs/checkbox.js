import React from 'react';
const CheckBox = ({value, onValueChange}) =>
  React.createElement('input', {
    type: 'checkbox',
    checked: value,
    onChange: e => onValueChange && onValueChange(e.target.checked),
  });
export default CheckBox;
