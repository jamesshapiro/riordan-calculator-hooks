// Usage

// function App() {
//     const [hasTimeElapsed, setHasTimeElapsed] = React.useState(false);
//     useTimeout(() => {
//         setHasTimeElapsed(true);
//     }, 5000);
//     return (
//         <p>
//             {hasTimeElapsed
//                 ? '5 seconds has passed!'
//                 : 'The timer is running…'}
//         </p>
//     )
// }
//
// In this example, the first render will happen instantly, with hasTimeElapsed being false. Then, 5 seconds later, it'll re-render with hasTimeElapsed set to true.
//
// Any other renders in the meantime, caused by a parent component, won't affect anything.
// Cancelling
// You can cancel the timeout by changing the delay property to null:

// function App() {
//     const [abortTimeout, setAbortTimeout] = React.useState(false);
//     const [hasTimeElapsed, setHasTimeElapsed] = React.useState(false);
//     useTimeout(() => {
//       setHasTimeElapsed(true);
//     }, abortTimeout ? null : 5000);
//     return (
//       <p>
//         {hasTimeElapsed && 'Boom!'}
//         <button onClick={() => setAbortTimeout(true)}>
//           Defuse Bomb
//         </button>
//       </p>
//     )
// }
//
// In this example, if the user clicks the button before the timeout has expired, the timeout will be canceled, and will never fire.
//
// You can also capture the timeout ID to cancel it imperatively:
// function App() {
//     const [hasTimeElapsed, setHasTimeElapsed] = React.useState(false);
//     const timeoutRef = useTimeout(() => {
//       setHasTimeElapsed(true);
//     }, 5000);
//     return (
//       <p>
//         {hasTimeElapsed && 'Boom!'}
//         <button onClick={() => window.clearTimeout(timeoutRef.current)}>
//           Defuse Bomb
//         </button>
//       </p>
//     )
// }
//
// Explanation
// You might be wondering: why is this needed? Can't you just use setTimeout instead?
//
// There are 3 problems with using window.setTimeout in React:
//
// This will break if your application is statically-generated or server-side rendered, since window isn't defined*
// A new timeout will be scheduled whenever this component renders, instead of only once when the component mounts. If our parent component re-renders 10 times, we'll schedule 10 timeouts.
// Our callback function is stale; it won't have access to current values for state and props.
// That last issue is tricky, and it requires a very clear mental model of how React and JavaScript work (and how they're a bit incompatible with each other).
//
// Dan Abramov wrote about this discrepancy, and how to overcome it, in a fantastic article about useInterval. The exact same principles apply for useTimeout. If you're keen to develop a deeper understanding of React, I highly recommend checking it out.

import React from 'react';
export default function useTimeout(callback, delay) {
  const timeoutRef = React.useRef(null);
  const savedCallback = React.useRef(callback);
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  React.useEffect(() => {
    const tick = () => savedCallback.current();
    if (typeof delay === 'number') {
      timeoutRef.current = window.setTimeout(tick, delay);
      return () => window.clearTimeout(timeoutRef.current);
    }
  }, [delay]);
  return timeoutRef;
}
