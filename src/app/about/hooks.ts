// Copyright (c) 2023 Eray Erdin
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

"use client";

import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";

export const useMetadata = () => {
  console.log("Using metadata...");
  const [ metadata, setMetadata ] = useState<Metadata | null>(null);
  console.trace("state", { metadata });

  useEffect(() => {
    invoke<Metadata>("get_metadata")
      .then(setMetadata)
      .catch((e) => console.error(e));
  }, []);

  return metadata;
}