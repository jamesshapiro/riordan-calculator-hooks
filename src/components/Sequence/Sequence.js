import React from 'react';

import { DataContext } from '../DataProvider';
import NumberBox from '../NumberBox';

function Sequence({ initialSequence, sequenceId }) {
  const { sequenceLength } = React.useContext(DataContext);
  console.log(sequenceLength);

  const [sequence, setSequence] = React.useState(initialSequence);
  const delta = sequenceId === 'f' ? sequenceLength : 0;
  return (
    <tr>
      <td>{sequenceId}</td>
      {sequence.slice(0, sequenceLength).map((num, index) => {
        return (
          <td>
            <NumberBox initialValue={num} index={index + delta} />
          </td>
        );
      })}
    </tr>
  );
}

export default Sequence;
