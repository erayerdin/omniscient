// Copyright (c) 2023 Eray Erdin
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

"use client";

import { SortDescriptor } from "@nextui-org/react";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

type FetchProcessesParams = {
  sortDescriptor: SortDescriptor,
  filterText: string | null
}

export const useProcesses = () => {
  const [ processes, setProcesses ] = useState<Process[]>([]);
  const [ filterText, setFilterText ] = useState<string>("");
  const [ sortDescriptor, setSortDescriptor ] = useState<SortDescriptor>({ column: "memoryUsage", direction: "descending" });

  const [ filterTextVal ] = useDebounce(filterText, 1000);

  const fetchProcesses = async ({ filterText, sortDescriptor }: FetchProcessesParams) => {
    console.log("Fetcing processes...");
    const processes: Process[] = await invoke('get_processes', { sortDescriptor, filterText });
    console.trace("processes", processes);
    return processes;
  }

  const killProcess = async ({ pid }: Process) => {
    console.log("Killing process...", pid);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Fetching processes...");
      fetchProcesses({ sortDescriptor, filterText: filterTextVal.trim().length === 0 ? null : filterTextVal })
        .then(setProcesses);
    }, 1000);
    
    return () => clearInterval(interval)
  }, [filterTextVal, sortDescriptor]);

  return { processes, filterText: filterTextVal, setFilterText, sortDescriptor, setSortDescriptor, killProcess };
}
