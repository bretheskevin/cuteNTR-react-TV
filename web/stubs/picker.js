import React from 'react';
const PickerItem = ({label}) => React.createElement('option', {}, label);
const Picker = ({children, selectedValue, onValueChange}) =>
  React.createElement(
    'select',
    {
      value: selectedValue,
      onChange: e => onValueChange && onValueChange(e.target.value),
    },
    children,
  );
Picker.Item = PickerItem;
export {Picker};
export default Picker;
