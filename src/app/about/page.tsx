// Copyright (c) 2023 Eray Erdin
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

"use client";

import { Button, Card, CircularProgress } from "@nextui-org/react";
import { useMetadata } from "./hooks";

function AboutPage() {
  const metadata = useMetadata();

  return (
    metadata == null
      ? (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          {/** Header */}
          <header className="flex flex-col space-y-2">
            <span className="flex space-x-4 items-center">
              <p className="text-2xl">
                {metadata.name[0].toUpperCase() + metadata.name.slice(1)}
              </p>
              <Card className="text-xs p-1">{metadata.version}</Card>
            </span>
            <p>{metadata.description}</p>
            <p><strong>License:</strong> {metadata.license}</p>
            <p>Powered by Rust, Tauri, Typescript, NextJS and React.</p>
            <a href={metadata.repositoryUrl} target="_blank">
              <Button className="bg-blue-500">See the source code</Button>
            </a>
          </header>
          <section className="flex flex-col space-y-2">
            <p className="text-2xl">Authors</p>
            <div className="flex flex-wrap space-x-2 space-y-2">
              {metadata.authors.map((author) => (
                <Card key={author} className="p-2">{author}</Card>
              ))}
            </div>
          </section>
        </div>
      )
  )
}

export default AboutPage