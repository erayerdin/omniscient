// Copyright (c) 2023 Eray Erdin
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

"use client";

import { Input, SortDescriptor, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { useState } from "react";

const generateFakeProcesses = () => {
  const genFakeName = (len: number) => {
    const symbols = [
      "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u",
      "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P",
      "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    ];

    return Array(len).fill(0).map(() => symbols[Math.floor(symbols.length * Math.random())]).join('');
  }

  return Array(100).fill(0).map((_, i): Process => {
    const name = genFakeName(5);
    const path = `/foo/${name}`;

    return {
      pid: i,
      path,
      cpuUsage: Math.random() * 100,
      memoryUsage: Math.random() * 8 * 1024 * 1024 * 1024,
    };
  });
}

function ProcessListPage() {
  const [ isLoading, setLoading ] = useState<boolean>(true);

  const fetchProcesses = async () => {
    console.log("Fetcing processes...");
    const processes: Process[] = generateFakeProcesses();
    console.trace("processes", processes);
    return processes;
  };

  const sortProcesses = (a: Process, b: Process, sortDescriptor: SortDescriptor) => {
    console.log("Sorting processes...");
    type ProcessKey = keyof typeof a;

    let { column, direction } = sortDescriptor;
    console.log("sort descriptor", sortDescriptor);

    let [ first, second ] = [
      a[column as ProcessKey],
      b[column as ProcessKey],
    ];
    
    let cmp: number;
    if ([typeof first, typeof second].every(((t) => t == "number"))) {
      cmp = first < second ? -1 : 1;
    } else {
      cmp = parseInt(first.toString()) < parseInt(second.toString()) ? -1 : 1;
    }

    if (direction == "descending") {
      cmp *= -1;
    }

    return cmp;
  };

  const processes = useAsyncList<Process>({
    load: async ({ sortDescriptor }) => {
      console.log("Loading processes...");

      setLoading(_ => true);
      const fetchedProcesses = await fetchProcesses();
      setLoading(_ => false);

      return { items: fetchedProcesses, sortDescriptor };
    },
    sort: async ({ items, sortDescriptor }) => {
      return {
        items: items.sort((a, b) => sortProcesses(a, b, sortDescriptor)),
      };
    },
    initialSortDescriptor: { column: "memoryUsage", direction: "descending" },
  });

  return (
    <div className="flex flex-col space-y-2">
      <Input type="search" placeholder="Search for processes" />
      <div className="">
        <Table
          isHeaderSticky
          className="overflow-y-scroll h-screen"
          sortDescriptor={processes.sortDescriptor}
          onSortChange={processes.sort}
        >
          <TableHeader>
            <TableColumn>PID</TableColumn>
            <TableColumn key="path" allowsSorting>Path</TableColumn>
            <TableColumn key="cpuUsage" allowsSorting>CPU</TableColumn>
            <TableColumn key="memoryUsage" allowsSorting>Memory</TableColumn>
          </TableHeader>
          <TableBody loadingContent={<Spinner />} items={processes.items} isLoading={isLoading}>
            {(p) => {
              const cpuUsage = p.cpuUsage.toFixed(2);
              
              const memoryUsageBytes = p.memoryUsage;
              const memoryUsageKilobytes = memoryUsageBytes / 1024;
              const memoryUsageMegabytes = memoryUsageKilobytes / 1024;
              const memoryUsageGigabytes = memoryUsageMegabytes / 1024;

              let memoryUsageHumanReadable: string;
              let memoryUsageMeasureType: "kB" | "mB" | "gB";

              memoryUsageHumanReadable = memoryUsageKilobytes.toFixed(2);
              memoryUsageMeasureType = "kB";

              if (memoryUsageKilobytes > 1024) {
                memoryUsageHumanReadable = memoryUsageMegabytes.toFixed(2);
                memoryUsageMeasureType = "mB";
              }

              if (memoryUsageMegabytes > 1024) {
                memoryUsageHumanReadable = memoryUsageGigabytes.toFixed(2);
                memoryUsageMeasureType = "gB";
              }

              return (
                <TableRow key={p.pid}>
                  <TableCell>{p.pid}</TableCell>
                  <TableCell>{p.path}</TableCell>
                  <TableCell>{cpuUsage}%</TableCell>
                  <TableCell>{memoryUsageHumanReadable} {memoryUsageMeasureType}</TableCell>
                </TableRow>
              );
            }}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ProcessListPage