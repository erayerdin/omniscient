// Copyright (c) 2023 Eray Erdin
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { SortDescriptor } from "@nextui-org/react";
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

export const useProcesses = () => {
  const [ processes, setProcesses ] = useState<Process[]>([]);
  const [ sortDescriptor, setSortDescriptor ] = useState<SortDescriptor>({ column: "memoryUsage", direction: "descending" });

  const fetchProcesses = async () => {
    console.log("Fetcing processes...");
    const processes: Process[] = generateFakeProcesses();
    console.trace("processes", processes);
    return processes;
  }

  const sortProcesses = (processes: Process[], sortDescriptor: SortDescriptor) => {
    const sortedProcesses = processes.sort((a, b) => {
      type ProcessKeyType = keyof typeof a;
      const { column, direction } = sortDescriptor;

      const [ first, second ] = [
        a[column as ProcessKeyType],
        b[column as ProcessKeyType],
      ];

      let cmp: number;
      if ([typeof first, typeof second].includes("number")) {
        cmp = first < second ? -1 : 1;
      } else {
        cmp = parseInt(first.toString()) < parseInt(second.toString()) ? -1 : 1;
      }

      if (direction === "ascending") {
        cmp *= -1;
      }

      return cmp;
    });

    return sortedProcesses;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      fetchProcesses().then((val) => {
        const sortedProcesses = sortProcesses(val, sortDescriptor);
        setProcesses(sortedProcesses);
      });
    }, 1000);
    
    return () => clearInterval(interval)
  }, [sortDescriptor]);

  return { processes, sortDescriptor, setSortDescriptor };
}
