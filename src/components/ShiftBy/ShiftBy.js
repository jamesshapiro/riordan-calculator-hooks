// It's used like this:

// JSX
// <ShiftBy x={-3}>
//   <Heading>Slightly Misaligned Heading</Heading>
// </ShiftBy>

import React from 'react';
function ShiftBy({ x = 0, y = 0, children }) {
  return (
    <div
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
    >
      {children}
    </div>
  );
}
export default ShiftBy;