// Copyright (c) 2023 Eray Erdin
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { CircularProgress, Modal, ModalBody, ModalContent, ModalHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useCpuInfo } from "../hooks";

const CpuModal = ({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: () => void }) => {
  const cpus = useCpuInfo();
  
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => {
          return (
            <>
              <ModalHeader className="flex flex-col gap-1 items-center">
                CPU Information
              </ModalHeader>
              <ModalBody className="flex items-center">
                {
                  cpus.length === 0
                    ? <CircularProgress aria-label="Loading CPU information..." />
                    : (
                      <Table>
                        <TableHeader>
                          <TableColumn>Name</TableColumn>
                          <TableColumn>Vendor ID</TableColumn>
                          <TableColumn>Brand</TableColumn>
                          <TableColumn>Frequency</TableColumn>
                        </TableHeader>
                        <TableBody>
                          {cpus.map((cpu) => (
                            <TableRow key={cpu.name}>
                              <TableCell>{cpu.name}</TableCell>
                              <TableCell>{cpu.vendorId}</TableCell>
                              <TableCell>{cpu.brand}</TableCell>
                              <TableCell>{cpu.frequency} MHz</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )
                }
              </ModalBody>
            </>
          )
        }}
      </ModalContent>
    </Modal>
  );
}

export default CpuModal