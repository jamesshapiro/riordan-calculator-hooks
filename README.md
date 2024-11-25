# Riordan Calculator

## Riordan Calculator

This project is created with [Parcel](https://parceljs.org/), a modern JS build tool. It's intended to be run locally, on your computer, using Node.js and NPM.

- Create a new component.
  - Don't forget, you can use an NPM script to generate the scaffolding for you!

## Getting started

```
npm install
```

## Useful Commands

```
npm run dev
npm run build
npm link new-component (to add my own version of new-component)
nc NewComponentName (my alias for npm run new-component NewComponentName)
```

## How to get sound working:

https://stackoverflow.com/questions/78337527/how-to-get-the-use-sound-hook-working-with-parcel

1. create a .parcelrc file in the root directory with the following contents:

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.{au,wav,mp3}": ["@parcel/transformer-raw"]
  }
}
```

2.

- (a.) run `npm install howler`
- (b.) run `npm install use-sound`

3. at the bottom level of your package.json (e.g. right after dependencies), include the following line:

```json
"alias": {
    "howler": "howler/dist/howler.core.min.js"
},
```

4. Upload your sounds to src/sounds/[example_sound.mp3]

5. Finally, here's a code snippet using the sound effect:

```js
import React from 'react';

import useSound from 'use-sound';
import submitSound from '../../sounds/compute.wav';

function SubmitButton() {
  const [playSubmit] = useSound(submitSound);

  return <button onClick={playSubmit}>{'Submit'}</button>;
}

export default SubmitButton;
```
