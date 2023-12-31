// Copyright (c) 2023 Eray Erdin
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

"use client";

import { Card } from '@nextui-org/react';
import Link from 'next/link';
import React from 'react';
import Cog from './icons/Cog';
import ListBullet from './icons/ListBullet';
import QuestionMarkCircle from './icons/QuestionMarkCircle';

type NavEntryProps = {
  icon?: React.ReactNode,
  content: React.ReactNode,
  linkTo: string,
}

const NavEntry = ({ icon, content, linkTo }: NavEntryProps) => {
  console.trace("props", { icon, content, linkTo });

  return (
    <Link href={linkTo} className='flex p-xs hover:bg-blue-500 hover:rounded-lg'>
      {
        icon != null 
          ? <div className='mr-xs'>{icon}</div>
          : undefined
      }
      <div>{content}</div>
    </Link>
  )
}

const MainNav = () => {
  return (
    <Card className='p-xs h-full'>
      <NavEntry
        icon={<Cog />}
        content={<div>Overview</div>}
        linkTo='/'
      />
      <NavEntry
        icon={<ListBullet />}
        content={<div>Processes</div>}
        linkTo='/process-list'
      />
      <NavEntry
        icon={<QuestionMarkCircle />}
        content={<div>About</div>}
        linkTo='/about'
      />
    </Card>
  )
}

export default MainNav