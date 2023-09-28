"use client";

import { Card, CircularProgress } from "@nextui-org/react";
import { useEffect, useState } from "react";

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
  const [ currentCpu, setCurrentCpu ] = useState<number>(0);
  const [ currentMemory, setCurrentMemory ] = useState<number>(0);
  const [ totalMemory, setTotalMemory ] = useState<number>(0);
  const [ currentDisk, setCurrentDisk ] = useState(0);
  const [ totalDisk, setTotalDisk ] = useState(0);

  const fetchCpu = async () => {
    const randomFraction = Math.random();
    const randomValue = randomFraction * 100;
    return randomValue;
  };

  const fetchMemory = async () => {
    const randomFraction = Math.random();
    const randomValue = randomFraction * 16;
    return randomValue;
  };

  const fetchTotalMemory = async () => {
    return 16;
  };

  const fetchCurrentDisk = async () => {
    const randomFraction = Math.random();
    const randomValue = randomFraction * 549_755_813_888; // 512 GiB
    return randomValue;
  };

  const fetchTotalDisk = async () => {
    return 549_755_813_888; // 512 GiB
  };

  useEffect(() => {
    fetchTotalMemory().then((val) => setTotalMemory(val));
    fetchCurrentDisk().then((val) => setCurrentDisk(val));
    fetchTotalDisk().then((val) => setTotalDisk(val));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchCpu().then((val) => setCurrentCpu(val));
      fetchMemory().then((val) => setCurrentMemory(val));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentCpu, currentMemory]);

  return (
    <div className="flex">
      {/** header resource cards */}
      <header className="flex w-full justify-center space-x-2">
        <ResourceCard
          label="CPU"
          used={currentCpu}
          total={100}
          footer={(used, total) => <div>{(used / total * 100).toFixed(2)}%</div>}
        />
        <ResourceCard
          label="Memory"
          used={currentMemory}
          total={totalMemory}
          footer={(used, total) => <div>{used.toFixed(2)} / {total} GiB</div>}
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
