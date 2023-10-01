// Copyright (c) 2023 Eray Erdin
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { CircularProgress, Modal, ModalBody, ModalContent, ModalHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { useDiskInfo } from '../hooks';

const DiskModal = ({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: () => void }) => {
  const disks = useDiskInfo();
  console.trace("disks", disks);
  
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='xl'>
      <ModalContent>
        {(onClose) => {
          return (
            <>
              <ModalHeader className="flex flex-col gap-1 items-center">
                CPU Information
              </ModalHeader>
              <ModalBody className="flex items-center">
                {
                  disks.length === 0
                    ? <CircularProgress aria-label="Loading disk information..." />
                    : (
                      <Table>
                        <TableHeader>
                          <TableColumn>Name</TableColumn>
                          <TableColumn>Type</TableColumn>
                          <TableColumn>File System</TableColumn>
                          <TableColumn>Mount Point</TableColumn>
                          <TableColumn>Space</TableColumn>
                          <TableColumn>Is Removable?</TableColumn>
                        </TableHeader>
                        <TableBody>
                          {disks.map((disk) => {
                            let availableSpace = (disk.availableSpace / (1024 * 1024 * 1024)).toFixed(2);
                            let totalSpace = (disk.totalSpace / (1024 * 1024 * 1024)).toFixed(2);

                            return (
                              <TableRow key={disk.name}>
                                <TableCell>{disk.name}</TableCell>
                                <TableCell>{disk.type}</TableCell>
                                <TableCell>{disk.fileSystem}</TableCell>
                                <TableCell>{disk.mountPoint}</TableCell>
                                <TableCell>{availableSpace} GiBs / {totalSpace} GiBs</TableCell>
                                <TableCell>{disk.isRemovable ? "Yes" : "No"}</TableCell>
                              </TableRow>
                            );
                          })}
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

export default DiskModal