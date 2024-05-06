import React from 'react';

// import styled from 'styled-components';
import { MODES } from '../../constants';
import { DataContext } from '../DataProvider';

import * as style from './ModeComboBox.module.css';

import * as Select from '@radix-ui/react-select';
// import classnames from 'classnames';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@radix-ui/react-icons';

const ModeComboBox = ({ sequenceId }) => {
  const { mode, handleSelectMode, matrixId } = React.useContext(DataContext);
  const [value, setValue] = React.useState(mode);

  function handleSelectValue(selection) {
    setValue(selection);
    handleSelectMode(selection);
  }

  if (matrixId && value !== mode) {
    setValue(mode);
  }

  return (
    <div className={style.modeComboBox}>
      <Select.Root
        value={value}
        onValueChange={(selection) => handleSelectValue(selection)}
      >
        <Select.Trigger className={style.SelectTrigger} aria-label='Modes'>
          <Select.Value placeholder='Mode…' aria-label={value}>
            {MODES[value]}
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
              <Select.Group key='modes'>
                <Select.Label key='grouplabel' className={style.SelectLabel}>
                  Modes
                </Select.Label>
                {MODES.map((item) => {
                  return (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  );
                })}
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
    </div>
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

export default ModeComboBox;
