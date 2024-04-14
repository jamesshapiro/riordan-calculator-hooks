// Sometimes, the best tool for the job is polling.

// I recently found myself in a situation where I needed some code to run as soon as possible after an external third-party package has finished loading. Unfortunately, this library isn't distributed through NPM; it has to be added through a <script> tag.

// In most cases, when you need to know when some asynchronous work is done, the best tool to use is a Promise. But that option isn't available to us in this situation.

// The most widely-used example of a tool that does this is Google Analytics. When you copy/paste that “i,s,o,g,r,a,m” snippet, window.ga will become a special function. I personally ran into this problem with an e-commerce tool, Paddle.js.

// useRetryUntilResolved is a hook that will run a given function over and over until it returns a truthy value. Once a truthy value is returned, the hook wraps up and the loop ends.

// This hook depends on the useInterval hook. Be sure to grab that one first!

// Usage
// Here's how you can use this hook:

// JSX
// import React from 'react';
// import useRetryUntilResolved from './use-retry-until-resolved';
// function App() {
//     const isResolved = useRetryUntilResolved(() =>
//         typeof window.specialThing !== "undefined"
//     );
//     return (
//         <div>
//             Third-party library status: {
//                 isResolved ? "Loaded" : "Not loaded"
//             }
//         </div>
//     )
// }

// useRetryUntilResolved takes a callback. We can perform whatever check we need, to see if “the event” has happened. In the case of waiting for a third-party library, you can check for modifications to the window object. Really, though, you can use this hook for any sort of polling task.

// If we return false, the function will be retried. The default interval is 100ms, so it will try this function 10 times per second.

// When we return a truthy value, we signal that the condition has been satisfied. The loop will be stopped, and a bit of internal React state will be toggled to true.

// Running code when ready
// Most of the time, you won't just want to know if the third-party script has loaded. You'll also want to execute some code.

// Here's how you can do it with this hook:

// import React from 'react';
// import useRetryUntilResolved from './use-retry-until-resolved';
// function App() {
//     const isResolved = useRetryUntilResolved(() =>
//         typeof window.specialThing !== "undefined"
//     );
//     React.useEffect(() => {
//         // The third-party script hasn't loaded yet. Abort.
//         if (!isResolved) {
//             return;
//         }
//         // If we make it this far, we can be confident that
//         // the script has loaded! We can do whatever tasks
//         // we need:
//         window.specialThing.doSomething();
//     }, [isResolved])
//     return (
//     // Omitted for brevity
//   )
// }

// Our useEffect hook will fire whenever isResolved changes. isResolved is a boolean that initializes as false, and only changes when our callback function returns a truthy value. It won't re-run this effect on every tick.

// Link to this headingCustomizing the interval
// By default, useRetryUntilResolved will execute the provided callback every 100ms. You can specify a different value through a second argument:

// const isResolved = useRetryUntilResolved(
//     () => (
//         typeof window.specialThing !== "undefined"
//     ),
//     500
// );

// You might wish to do this if your callback is computationally expensive, if you need to do a whole bunch of work to test if the condition is satisfied or not. Don't optimize prematurely, though! Check and see how long the code takes to run. If it's only a few milliseconds, I wouldn't worry about it.

// You can also pick a quicker interval, if you really want the React app to update ASAP, but a worst-case delay of 100ms is acceptable to me. If something happens within 100ms or less, it feels nearly-instantaneous to humans.

// The big caveat
// So, here's the thing about this hook: you shouldn't really use it in most situations.

// There are usually lots of better ways to check when an asynchronous event has fired. You could use a Promise. You could use an event listener. If you felt fancy, you could use a generator!

// This hook is meant as a last resort when you need to depend on third-party code that doesn't give you any other options.

// When you do find yourself in this situation, though, this hook can be really handy. And even though polling isn't often the best solution to a problem, it's also not a bad solution. It feels a bit wasteful / inelegant, but honestly it provides a near-identical user experience, and at the end of the day, that's all that really matters.

import React from 'react';
import useInterval from './use-interval.hook';
function useRetryUntilResolved(callback, interval = 100) {
  const [hasResolved, setHasResolved] = React.useState(false);
  useInterval(
    () => {
      const result = callback();
      if (result) {
        setHasResolved(true);
      }
    },
    hasResolved ? null : interval
  );
  return hasResolved;
}
export default useRetryUntilResolved;
