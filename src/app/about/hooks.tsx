// Copyright (c) 2023 Eray Erdin
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { invoke } from "@tauri-apps/api";
import { useEffect, useState } from "react";

export const useMetadata = () => {
  const [ metadata, setMetadata ] = useState<Metadata | null>(null);

  useEffect(() => {
    invoke<Metadata>("getMetadata")
      .then(setMetadata)
      .catch((e) => console.error(e));
  }, []);

  return metadata;
}