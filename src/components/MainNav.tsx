// Copyright (c) 2023 Eray Erdin
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Card } from '@nextui-org/react'
import Link from 'next/link'
import React from 'react'
import Cog from './icons/Cog'

type NavEntryProps = {
  icon?: React.ReactNode,
  content: React.ReactNode,
  linkTo: string,
}

const NavEntry = ({ icon, content, linkTo }: NavEntryProps) => {
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
        icon={<Cog />}
        content={<div>Overview</div>}
        linkTo='/'
      />
      <NavEntry
        icon={<Cog />}
        content={<div>Overview</div>}
        linkTo='/'
      />
      <NavEntry
        icon={<Cog />}
        content={<div>Overview</div>}
        linkTo='/'
      />
    </Card>
  )
}

export default MainNav