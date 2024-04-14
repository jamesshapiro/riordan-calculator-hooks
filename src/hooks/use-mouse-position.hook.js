// Performance
// This component will re-render whenever the user moves the mouse. This can be dozens and dozens of times a second.

// Originally, this hook included “throttle” functionality, which would limit the updates to a user-specified interval. In testing, though, it seemed to make performance worse. No matter how hard I tried, I couldn't come up with a contrived scenario where the throttle actually improved performance (while still updating often enough for smooth animations).

// That said, you do still need to be a bit careful where you use this hook. It shouldn't be used in a top-level component like App or Homepage, since that will cause a huge chunk of your React tree to re-render very often. Use this hook in the small “leaf node” components near the bottom of the tree.

// For maximum performance, you can use a library like React Spring or Framer Motion, which will allow you to update values without triggering React renders. In my experience, though, as long as you're using this hook on smaller components that don't have a big DOM impact, you should be just fine.

import React from 'react';
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = React.useState({
    x: null,
    y: null,
  });
  React.useEffect(() => {
    const updateMousePosition = (ev) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);
  return mousePosition;
};
export default useMousePosition;
