import React from 'react';

import { sequences } from '../../data';
import { DataContext } from '../DataProvider';
import * as style from './SequenceComboBox.module.css';
import './style.css';

import * as Select from '@radix-ui/react-select';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@radix-ui/react-icons';

const SequenceComboBox = ({ sequenceId }) => {
  const { handleSelectSequence, currentGSelection, currentFSelection } =
    React.useContext(DataContext);
  const currentSelection =
    sequenceId === 'g' ? currentGSelection : currentFSelection;

  // const [value, setValue] = React.useState(initialValue);

  function handleSelectValue(selection) {
    // setValue(selection);
    handleSelectSequence(sequenceId, selection);
  }

  return (
    <Select.Root
      value={currentSelection}
      onValueChange={(selection) => handleSelectValue(selection)}
    >
      <Select.Trigger className={style.SelectTrigger} aria-label='Sequences'>
        <Select.Value placeholder='Sequence…' aria-label={currentSelection}>
          {sequences[currentSelection]}
        </Select.Value>
        <Select.Icon className={style.SelectIcon}>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className={style.SelectContent}>
          <Select.ScrollUpButton className={style.SelectScrollButton}>
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className={style.SelectViewport}>
            <Select.Group>
              <Select.Label key='grouplabel' className={style.SelectLabel}>
                Sequences
              </Select.Label>
              {sequences.map((item) => {
                return (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                );
              })}
              <SelectItem value={'custom'}>{'Custom'}</SelectItem>
            </Select.Group>
            {/* <Select.Separator className={style.SelectSeparator} />
          <Select.Group></Select.Group> */}
          </Select.Viewport>
          <Select.ScrollDownButton className={style.SelectScrollButton}>
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

const SelectItem = React.forwardRef(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Item className={'SelectItem'} {...props} ref={forwardedRef}>
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className={style.SelectItemIndicator}>
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  }
);

export default SequenceComboBox;
