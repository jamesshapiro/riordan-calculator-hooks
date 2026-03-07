import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';
import styled from 'styled-components';

const UserDropdown = ({ user, children }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className='DropdownIconButton' aria-label='Customise options'>
          {children}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className='DropdownMenuContent' sideOffset={5}>
          <DropdownMenu.Item asChild className='DropdownMenuItem'>
            <DropdownLink href='/sequences'>
              Sequences
            </DropdownLink>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild className='DropdownMenuItem'>
            <DropdownLink href='/history'>
              History
            </DropdownLink>
          </DropdownMenu.Item>

          {/* <DropdownMenu.Separator className='DropdownMenuSeparator' />
          <DropdownMenu.CheckboxItem
            className='DropdownMenuCheckboxItem'
            checked={bookmarksChecked}
            onCheckedChange={setBookmarksChecked}
          >
            <DropdownMenu.ItemIndicator className='DropdownMenuItemIndicator'>
              <CheckIcon />
            </DropdownMenu.ItemIndicator>
            Show Bookmarks <div className='RightSlot'>⌘+B</div>
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem
            className='DropdownMenuCheckboxItem'
            checked={urlsChecked}
            onCheckedChange={setUrlsChecked}
          >
            <DropdownMenu.ItemIndicator className='DropdownMenuItemIndicator'>
              <CheckIcon />
            </DropdownMenu.ItemIndicator>
            Show Full URLs
          </DropdownMenu.CheckboxItem> */}

          <DropdownMenu.Arrow className='DropdownMenuArrow' />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default UserDropdown;

const DropdownLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  display: block;
  width: 100%;
`;
