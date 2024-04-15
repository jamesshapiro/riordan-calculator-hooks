import React from 'react';

// import styled from 'styled-components';
import { sequences } from '../../data';
import { DataContext } from '../DataProvider';

import * as Select from '@radix-ui/react-select';
// import classnames from 'classnames';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@radix-ui/react-icons';
import './styles.css';

const SequenceComboBox = ({ sequenceId }) => {
  const [value, setValue] = React.useState('catalan');
  const { handleSelectSequence } = React.useContext(DataContext);

  function handleSelectValue(selection) {
    setValue(selection);
    handleSelectSequence(sequenceId, selection);
  }

  return (
    <Select.Root
      value={value}
      onValueChange={(selection) => handleSelectValue(selection)}
    >
      <Select.Trigger className="SelectTrigger" aria-label="Sequences">
        <Select.Value placeholder="Sequence…" aria-label={value}>
          {sequences[value]}
        </Select.Value>
        <Select.Icon className="SelectIcon">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="SelectContent">
          <Select.ScrollUpButton className="SelectScrollButton">
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className="SelectViewport">
            <Select.Group>
              <Select.Label className="SelectLabel">Sequences</Select.Label>
              {sequences.map((item) => {
                return <SelectItem value={item.id}>{item.name}</SelectItem>;
              })}
            </Select.Group>
            {/* <Select.Separator className="SelectSeparator" />
          <Select.Group></Select.Group> */}
          </Select.Viewport>
          <Select.ScrollDownButton className="SelectScrollButton">
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
        <Select.ItemIndicator className="SelectItemIndicator">
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  }
);

export default SequenceComboBox;
