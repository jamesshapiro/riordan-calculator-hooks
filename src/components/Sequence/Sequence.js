import React from 'react';

import { DataContext } from '../DataProvider';
import NumberBox from '../NumberBox';

function Sequence({ initialSequence }) {
  const { sequenceLength } = React.useContext(DataContext);
  console.log(sequenceLength);

  const [sequence, setSequence] = React.useState(initialSequence);
  return (
    <div>
      {sequence.slice(0, sequenceLength).map((num) => {
        return <NumberBox initialValue={num} />;
      })}
    </div>
  );
}

export default Sequence;
