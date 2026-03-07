'use client';

import React from 'react';
import { sequences } from '@/data';
import { UserContext } from '@/components/UserProvider/UserProvider';
import { DataContext } from '@/components/DataProvider/DataProvider';
import style from './SequenceComboBox.module.css';
import './style.css';
import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

const SequenceComboBox = ({ sequenceId }: { sequenceId: string }) => {
  const { handleSelectSequence, currentGSelection, currentFSelection } = React.useContext(DataContext);
  const { userSequences, userDefaultHiddenSequences } = React.useContext(UserContext);
  const currentSelection = sequenceId === 'g' ? currentGSelection : currentFSelection;

  function handleSelectValue(selection: string) {
    handleSelectSequence(sequenceId, selection);
  }

  const userSequencesExist = userSequences.length > 0;

  return (
    <Select.Root value={currentSelection} onValueChange={handleSelectValue}>
      <Select.Trigger className={style.SelectTrigger} aria-label='Sequences'>
        <Select.Value placeholder='Sequence…' aria-label={currentSelection}>
          {(sequences as any)[currentSelection]}
        </Select.Value>
        <Select.Icon className={style.SelectIcon}><ChevronDownIcon /></Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className={style.SelectContent}>
          <Select.ScrollUpButton className={style.SelectScrollButton}><ChevronUpIcon /></Select.ScrollUpButton>
          <Select.Viewport className={style.SelectViewport}>
            <Select.Group>
              <Select.Label key='grouplabel' className={style.SelectLabel}>Default Sequences</Select.Label>
              {sequences.map((item) => {
                if (userDefaultHiddenSequences && Array.isArray(userDefaultHiddenSequences) && userDefaultHiddenSequences.includes(item.id)) return null;
                return <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>;
              })}
              <SelectItem value='custom'>Custom</SelectItem>
            </Select.Group>
            {userSequencesExist && <Select.Separator className='SelectSeparator' />}
            {userSequencesExist && (
              <Select.Group>
                <Select.Label key='customlabel' className={style.SelectLabel}>Custom Sequences</Select.Label>
                {userSequences.map((item: any) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}
              </Select.Group>
            )}
          </Select.Viewport>
          <Select.ScrollDownButton className={style.SelectScrollButton}><ChevronDownIcon /></Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

const SelectItem = React.forwardRef<HTMLDivElement, any>(({ children, className, ...props }, forwardedRef) => {
  return (
    <Select.Item className='SelectItem' {...props} ref={forwardedRef}>
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className={style.SelectItemIndicator}><CheckIcon /></Select.ItemIndicator>
    </Select.Item>
  );
});

SelectItem.displayName = 'SelectItem';

export default SequenceComboBox;
