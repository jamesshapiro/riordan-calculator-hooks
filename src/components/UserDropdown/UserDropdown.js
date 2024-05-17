import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  HamburgerMenuIcon,
  DotFilledIcon,
  CheckIcon,
  ChevronRightIcon,
} from '@radix-ui/react-icons';
import './styles.css';

import { Link } from 'react-router-dom';

const UserDropdown = ({ user, children }) => {
  const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
  const [urlsChecked, setUrlsChecked] = React.useState(false);
  const [person, setPerson] = React.useState('pedro');

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className='DropdownIconButton' aria-label='Customise options'>
          {children}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className='DropdownMenuContent' sideOffset={5}>
          <Link to='/sequences'>
            <DropdownMenu.Item className='DropdownMenuItem'>
              Sequences
            </DropdownMenu.Item>
          </Link>
          <Link to='/history'>
            <DropdownMenu.Item className='DropdownMenuItem'>
              History
            </DropdownMenu.Item>
          </Link>

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
