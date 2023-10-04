// Copyright (c) 2023 Eray Erdin
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

"use client";

import { Input, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useProcesses } from "./hooks";

function ProcessListPage() {
  const { processes, filterText, setFilterText, sortDescriptor, setSortDescriptor, killProcess } = useProcesses();

  return (
    <div className="flex flex-col space-y-2">
      <Input
        type="search"
        placeholder="Search for processes"
        onChange={(e) => {
          console.log("Process search has changed.");
          const value = e.target.value;
          setFilterText(value);
        }}
      />
      <div className="">
        <Table
          isHeaderSticky
          className="overflow-y-scroll scroll-y h-screen"
          layout="fixed"
          sortDescriptor={sortDescriptor}
          onSortChange={(sortDescriptor) => {
            setSortDescriptor(sortDescriptor);
            console.trace("Sort descriptor changed", sortDescriptor);
          }}
          onRowAction={(key) => {
            const process = processes.find((p) => p.pid === key);
            
            if (process !== undefined) {
              killProcess(process);
            }
          }}
        >
          <TableHeader>
            <TableColumn>PID</TableColumn>
            <TableColumn key="path" allowsSorting>Path</TableColumn>
            <TableColumn key="cpuUsage" allowsSorting>CPU</TableColumn>
            <TableColumn key="memoryUsage" allowsSorting>Memory</TableColumn>
          </TableHeader>
          <TableBody loadingContent={<Spinner />} items={processes}>
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