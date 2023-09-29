"use client";

import { Card, CircularProgress, Modal, ModalBody, ModalContent, ModalHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react";
import { useCpuInfo, useOverviewInfo } from "./hooks";

type ResourceCardProps = {
  label: string,
  used: number,
  total: number,
  footer: (used: number, total: number) => React.ReactNode,
  onPress?: () => void,
}

const ResourceCard = ({ label, used, total, footer, onPress }: ResourceCardProps) => {
  const value = used / total;
  const valuePercent = value * 100;

  let color = "danger";

  if (valuePercent < 45) {
    color = "success";
  } else if (valuePercent < 75) {
    color = "primary";
  } else if (valuePercent < 90) {
    color = "warning";
  }

  return (
    <Card onPress={onPress} isPressable={onPress !== null} className="flex p-sm items-center space-y-2 w-64">
      <header className="text-xl">{label}</header>
      <CircularProgress
        size="lg"
        aria-label={label}
        classNames={{
          svg: "w-32 h-32"
        }}
        value={valuePercent}
        color={color as any}
      />
      <footer>{footer(used, total)}</footer>
    </Card>
  );
}

const CpuModal = ({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: () => void }) => {
  const cpus = useCpuInfo();
  console.log(cpus);

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

export default function Home() {
  const overviewInfo = useOverviewInfo();
  const { isOpen: isCpuModalOpen, onOpen: onCpuModalOpen, onOpenChange: onCpuModalOpenChange } = useDisclosure();

  return (
    <div className="flex">
      {/** header resource cards */}
      <header className="flex w-full justify-center space-x-2">
        <ResourceCard
          label="CPU"
          used={overviewInfo.currentCpuUsage}
          total={100}
          footer={(used, total) => <div>{(used / total * 100).toFixed(2)}%</div>}
          onPress={onCpuModalOpen}
        />
        <ResourceCard
          label="Memory"
          used={overviewInfo.currentMemoryUsage}
          total={overviewInfo.totalMemoryAmount}
          footer={(used, total) => <div>{used.toFixed(2)} / {total.toFixed(2)} GiB</div>}
        />
        <ResourceCard
          label="Disk"
          used={overviewInfo.currentDiskUsage}
          total={overviewInfo.totalDiskAmount}
          footer={(used, total) => <div>{used.toFixed(2)} / {total.toFixed(2)} GiB</div>}
        />
      </header>

      {/** Modals */}
      <CpuModal isOpen={isCpuModalOpen} onOpenChange={onCpuModalOpenChange} />
    </div>
  )
}
