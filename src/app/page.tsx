"use client";

import { useDisclosure } from "@nextui-org/react";
import CpuModal from "./components/CpuModal";
import DiskModal from "./components/DiskModal";
import ResourceCard from "./components/ResourceCard";
import { useOverviewInfo } from "./hooks";

export default function Home() {
  const overviewInfo = useOverviewInfo();
  const { isOpen: isCpuModalOpen, onOpen: onCpuModalOpen, onOpenChange: onCpuModalOpenChange } = useDisclosure();
  const { isOpen: isDiskModalOpen, onOpen: onDiskModalOpen, onOpenChange: onDiskModalOpenChange } = useDisclosure();

  console.trace("overview info", { overviewInfo });
  console.trace("modals", { isCpuModalOpen, isDiskModalOpen });

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
          onPress={onDiskModalOpen}
        />
      </header>

      {/** Modals */}
      <CpuModal isOpen={isCpuModalOpen} onOpenChange={onCpuModalOpenChange} />
      <DiskModal isOpen={isDiskModalOpen} onOpenChange={onDiskModalOpenChange} />
    </div>
  )
}
