'use client';

import React from 'react';
import { MODES } from '../../constants';
import { DataContext } from '../DataProvider/DataProvider';
import style from './ModeComboBox.module.css';
import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

const ModeComboBox = () => {
  const { mode, handleSelectMode, matrixId } = React.useContext(DataContext);
  const [value, setValue] = React.useState(mode);

  function handleSelectValue(selection: string) {
    setValue(selection);
    handleSelectMode(selection);
  }

  if (matrixId && value !== mode) {
    setValue(mode);
  }

  return (
    <div className={style.modeComboBox}>
      <Select.Root value={value} onValueChange={(selection) => handleSelectValue(selection)}>
        <Select.Trigger className={style.SelectTrigger} aria-label='Modes'>
          <Select.Value placeholder='Mode…' aria-label={value}>
            {MODES.find(m => m.id === value)?.name || value}
          </Select.Value>
          <Select.Icon className={style.SelectIcon}><ChevronDownIcon /></Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className={style.SelectContent}>
            <Select.ScrollUpButton className={style.SelectScrollButton}><ChevronUpIcon /></Select.ScrollUpButton>
            <Select.Viewport className={style.SelectViewport}>
              <Select.Group key='modes'>
                <Select.Label key='grouplabel' className={style.SelectLabel}>Modes</Select.Label>
                {MODES.map((item) => (
                  <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                ))}
              </Select.Group>
            </Select.Viewport>
            <Select.ScrollDownButton className={style.SelectScrollButton}><ChevronDownIcon /></Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};

const SelectItem = React.forwardRef<HTMLDivElement, { children: React.ReactNode; value: string; className?: string }>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Item className={'SelectItem'} {...props} ref={forwardedRef}>
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className={style.SelectItemIndicator}><CheckIcon /></Select.ItemIndicator>
      </Select.Item>
    );
  }
);
SelectItem.displayName = 'SelectItem';

export default ModeComboBox;
