// Copyright (c) 2023 Eray Erdin
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

"use client";

import MainNav from '@/components/MainNav';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='dark'>
      <body className={inter.className}>
        <Providers>
          <div className="container flex h-screen">
            <div className="w-2/5 lg:w-1/4 m-sm">
              <MainNav />
            </div>
            <div className="w-3/5 lg:w-3/4 m-sm">
              <div>{children}</div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
