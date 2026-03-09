import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useRouter } from 'next/router';

const UserDropdown = ({ user, children }) => {
  const router = useRouter();
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className='DropdownIconButton' aria-label='Customise options'>
          {children}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className='DropdownMenuContent' sideOffset={5}>
          <DropdownMenu.Item
            className='DropdownMenuItem'
            onSelect={() => router.push('/sequences/', undefined, { shallow: true })}
          >
            Sequences
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className='DropdownMenuItem'
            onSelect={() => router.push('/history/', undefined, { shallow: true })}
          >
            History
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
