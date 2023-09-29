"use client";

import { Card, CircularProgress } from "@nextui-org/react";
import { useOverviewInfo } from "./hooks";

type ResourceCardProps = {
  label: string,
  used: number,
  total: number,
  footer: (used: number, total: number) => React.ReactNode,
}

const ResourceCard = ({ label, used, total, footer }: ResourceCardProps) => {
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
    <Card className="flex p-sm items-center space-y-2 w-64">
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

export default function Home() {
  const overviewInfo = useOverviewInfo();

  return (
    <div className="flex">
      {/** header resource cards */}
      <header className="flex w-full justify-center space-x-2">
        <ResourceCard
          label="CPU"
          used={overviewInfo.currentCpu}
          total={100}
          footer={(used, total) => <div>{(used / total * 100).toFixed(2)}%</div>}
        />
        <ResourceCard
          label="Memory"
          used={overviewInfo.currentMemory}
          total={overviewInfo.totalMemory}
          footer={(used, total) => <div>{used.toFixed(2)} / {total.toFixed(2)} GiB</div>}
        />
        <ResourceCard
          label="Disk"
          used={overviewInfo.currentDisk}
          total={overviewInfo.totalDisk}
          footer={(used, total) => <div>{used.toFixed(2)} / {total.toFixed(2)} GiB</div>}
        />
      </header>
    </div>
  )
}
