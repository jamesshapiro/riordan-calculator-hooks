import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import Link from 'next/link';

const UserDropdown = ({ user, children }: any) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className='DropdownIconButton' aria-label='Customise options'>
          {children}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className='DropdownMenuContent' sideOffset={5}>
          <Link href='/sequences'>
            <DropdownMenu.Item className='DropdownMenuItem'>
              Sequences
            </DropdownMenu.Item>
          </Link>
          <Link href='/history'>
            <DropdownMenu.Item className='DropdownMenuItem'>
              History
            </DropdownMenu.Item>
          </Link>

          <DropdownMenu.Arrow className='DropdownMenuArrow' />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default UserDropdown;
