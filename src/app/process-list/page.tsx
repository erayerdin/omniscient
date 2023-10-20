// Copyright (c) 2023 Eray Erdin
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

"use client";

import { Button, Input, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react";
import classNames from "classnames";
import { useState } from "react";
import KillProcessModal from "./components/KillProcessModal";
import { useProcesses } from "./hooks";

function ProcessListPage() {
  const { processes, setFilterText, sortDescriptor, setSortDescriptor, killProcess } = useProcesses();
  const killProcessDisclosure = useDisclosure();
  const [ selectedProcess, setSelectedProcess ] = useState<Process | null>(null);

  console.trace("state", { selectedProcess });
  
  return (
    <div className="flex flex-col space-y-2">
      <KillProcessModal
        selectedProcess={selectedProcess}
        setSelectedProcess={setSelectedProcess}
        disclosure={killProcessDisclosure}
      />
      <Input
        type="search"
        placeholder="Search for processes"
        onChange={(e) => {
          console.log("Process search has changed.");
          const value = e.target.value;
          setFilterText(value);
        }}
      />
      <Button
        className={classNames(
          { "bg-red-500": selectedProcess != null }
        )}
        onPress={selectedProcess !== null ? killProcessDisclosure.onOpen : undefined}
      >
        Kill Process
      </Button>
      <Table
        isHeaderSticky
        color="primary"
        selectionMode="single"
        selectedKeys={[selectedProcess].filter((p) => p !== null).map((p) => p!.pid)}
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
              <TableRow
                key={p.pid}
                className={classNames(
                  "cursor-pointer",
                  { "bg-blue-500": p.pid === selectedProcess?.pid }, 
                )}
                onClick={() => setSelectedProcess(p)}
              >
                <TableCell>{p.pid}</TableCell>
                <TableCell className="break-all">{p.path}</TableCell>
                <TableCell>{cpuUsage}%</TableCell>
                <TableCell>{memoryUsageHumanReadable} {memoryUsageMeasureType}</TableCell>
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
    </div>
  )
}

export default ProcessListPage