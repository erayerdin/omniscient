// Copyright (c) 2023 Eray Erdin
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { SortDescriptor } from "@nextui-org/react";
import { invoke } from "@tauri-apps/api";
import { useEffect, useState } from "react";

const fakeItemCount = 100;

const generateFakeName = () => {
  const genFakeName = (len: number) => {
    const symbols = [
      "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u",
      "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P",
      "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    ];

    return Array(len).fill(0).map(() => symbols[Math.floor(symbols.length * Math.random())]).join('');
  }

  return genFakeName(5);
}

const fakeNames = Array(fakeItemCount).fill(0).map(() => generateFakeName());

const generateFakeProcesses = () => {
  return Array(fakeItemCount).fill(0).map((_, i): Process => {
    const name = fakeNames[i];
    const path = `/foo/${name}`;

    return {
      pid: i,
      path,
      cpuUsage: Math.random() * 100,
      memoryUsage: Math.random() * 8 * 1024 * 1024 * 1024,
    };
  });
}

type FetchProcessesParams = {
  sortDescriptor: SortDescriptor,
  filterText: string | null
}

export const useProcesses = () => {
  const [ processes, setProcesses ] = useState<Process[]>([]);
  const [ filterText, setFilterText ] = useState<string>("");
  const [ sortDescriptor, setSortDescriptor ] = useState<SortDescriptor>({ column: "memoryUsage", direction: "descending" });

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
      fetchProcesses({ sortDescriptor, filterText: filterText.trim().length === 0 ? null : filterText })
        .then(setProcesses);
    }, 1000);
    
    return () => clearInterval(interval)
  }, [filterText, sortDescriptor]);

  return { processes, filterText, setFilterText, sortDescriptor, setSortDescriptor, killProcess };
}
