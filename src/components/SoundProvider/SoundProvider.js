import React from 'react';

export const SoundContext = React.createContext();

function SoundProvider({ children }) {
  const [volume, setVolume] = React.useState(() => {
    const savedVolume = localStorage.getItem('volume');
    return savedVolume !== null ? Number(savedVolume) : 1;
  });

  React.useEffect(() => {
    localStorage.setItem('volume', volume);
  }, [volume]);

  function toggleMute() {
    setVolume((oldValue) => (oldValue + 1) % 2);
  }

  return (
    <SoundContext.Provider
      value={{
        volume,
        setVolume,
        toggleMute,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export default SoundProvider;
