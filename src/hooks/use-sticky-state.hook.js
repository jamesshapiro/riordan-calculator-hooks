// Context
// The useState React hook is great for state that should be freshly initialized on every visit, but what about for state that should be persisted between sessions?

// A good example of this is filters. If I set a filter to sort based on price instead of newest items, that value should "stick", so that if I come back to this site in a week, it remembers that I want to sort by price.

// The useStickyState hook works just like useState, except it backs up to (and restores from) localStorage.

// Note that I've written a full post about this (https://www.joshwcomeau.com/react/persisting-react-state-in-localstorage/), with a lot more context. If you're curious to dig deeper, check it out here:

// Usage
// It's used just like React.useState, except it takes two arguments: a default value, and a key:

// JSX
// const SomeComponent() {
//   const [color, setColor] = useStickyState('blue', 'persisted-color');
// }
// The second argument, key, will be used as the localStorage key. It's important that each useStickyState instance uses a unique value.

// Link to this headingWarnings
// This hook is not SSR-safe—if you use SSR, or a framework that makes use of it (eg. Gatsby, Next.js), you'll get an error with this hook as-is.

// This is not an easy problem to solve; when the app is rendered on the server, we don't have access to the user's local-storage!

// The easiest solution would be to only use this hook in client-side components. The useHasMounted hook will come in handy here!

// I share more about this challenge in my blog post, The Perils of Rehydration. (https://www.joshwcomeau.com/react/the-perils-of-rehydration/)

function useStickyState(defaultValue, key) {
  const [value, setValue] = React.useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });
  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}
