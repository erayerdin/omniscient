"use client";

import { Card, CircularProgress } from "@nextui-org/react";

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
  return (
    <div className="flex">
      {/** header resource cards */}
      <header className="flex w-full justify-center space-x-2">
        <ResourceCard
          label="CPU"
          used={65}
          total={100}
          footer={(used, total) => <div>{used / total * 100}%</div>}
        />
        <ResourceCard
          label="Memory"
          used={7.4}
          total={16}
          footer={(used, total) => <div>{used} / {total} GiB</div>}
        />
        <ResourceCard
          label="Disk"
          used={45}
          total={512}
          footer={(used, total) => <div>{used} / {total} GiB</div>}
        />
      </header>
    </div>
  )
}
