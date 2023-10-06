// Copyright (c) 2023 Eray Erdin
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { invoke } from '@tauri-apps/api/tauri';

type KillProcessModalProps = {
  selectedProcess: Process | null
  setSelectedProcess: (process: Process | null) => void,
  disclosure: {
      isOpen: boolean;
      onOpen: () => void;
      onClose: () => void;
      onOpenChange: () => void;
      isControlled: boolean;
      getButtonProps: (props?: any) => any;
      getDisclosureProps: (props?: any) => any;
  },
}

const KillProcessModal = ({ selectedProcess, setSelectedProcess, disclosure }: KillProcessModalProps) => {
  const { isOpen, onOpenChange } = disclosure;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Kill the process?</ModalHeader>
            <ModalBody>
              Would you really like to kill the process
              with id {selectedProcess?.pid} on path {selectedProcess?.path}?
            </ModalBody>
            <ModalFooter>
              <Button onPress={onClose}>Cancel</Button>
              <Button
                color="danger"
                onPress={() => {
                  invoke("kill_process", { pid: selectedProcess?.pid }).then((isKilled) => {
                    setSelectedProcess(null);
                    onClose();
                  });
                }}
              >
                Kill the process
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default KillProcessModal