import React from 'react';
const Ionicons = ({name, size = 24, color = 'currentColor'}) =>
  React.createElement(
    'span',
    {
      style: {
        fontSize: size,
        color,
        display: 'inline-block',
        fontFamily: 'monospace',
      },
    },
    name,
  );
export default Ionicons;
