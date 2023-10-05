// Copyright (c) 2023 Eray Erdin
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

"use client";

import { invoke } from "@tauri-apps/api";
import { useEffect, useState } from "react";

export const useOverviewInfo = (): OverviewInfo => {
  const [ currentCpuUsage, setCurrentCpuUsage ] = useState<number>(0);
  const [ currentMemoryUsage, setCurrentMemoryUsage ] = useState<number>(0);
  const [ totalMemoryAmount, setTotalMemoryAmount ] = useState<number>(0);
  const [ currentDiskUsage, setCurrentDiskUsage ] = useState(0);
  const [ totalDiskAmount, setTotalDiskAmount ] = useState(0);

  console.trace("states", { currentCpuUsage, currentMemoryUsage, totalMemoryAmount, currentDiskUsage, totalDiskAmount });

  const fetchCpuUsage = async () => {
    console.log("Fetching cpu usage...");
    const cpuUsage: number = await invoke('get_cpu_usage');
    console.trace("Cpu usage", cpuUsage);
    return cpuUsage;
  };

  const fetchMemoryUsage = async () => {
    console.log("Fetching memory usage...");
    const memoryUsage: number = (await invoke('get_memory_usage')) as number / (1024 * 1024 * 1024);
    console.trace("Memory usage", memoryUsage);
    return memoryUsage;
  };

  const fetchTotalMemoryAmount = async () => {
    console.log("Fetching total memory amount...");
    const totalMemory: number = (await invoke('get_total_memory')) as number / (1024 * 1024 * 1024);
    console.trace("Total memory", totalMemory);
    return totalMemory;
  };

  const fetchCurrentDiskUsage = async () => {
    console.log("Fetching current disk usage...");
    const diskUsage: number = (await invoke('get_disk_usage')) as number / (1024 * 1024 * 1024);
    console.trace("Disk usage", diskUsage);
    return diskUsage;
  };

  const fetchTotalDiskAmount = async () => {
    console.log("Fetching total disk amount...");
    const totalDisk: number = (await invoke('get_total_disk')) as number / (1024 * 1024 * 1024);
    console.trace("Total disk", totalDisk);
    return totalDisk;
  };

  useEffect(() => {
    fetchTotalMemoryAmount().then((val) => setTotalMemoryAmount(val));
    fetchCurrentDiskUsage().then((val) => setCurrentDiskUsage(val));
    fetchTotalDiskAmount().then((val) => setTotalDiskAmount(val));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchCpuUsage().then((val) => setCurrentCpuUsage(val));
      fetchMemoryUsage().then((val) => setCurrentMemoryUsage(val));
    }, 1000);
    return () => {
      console.info("Clearing fetchCpuUsage and fetchMemoryUsage intervals...");
      clearInterval(interval);
    };
  }, [currentCpuUsage, currentMemoryUsage]);

  return {
    currentCpuUsage: currentCpuUsage,
    currentMemoryUsage: currentMemoryUsage,
    totalMemoryAmount: totalMemoryAmount,
    currentDiskUsage: currentDiskUsage,
    totalDiskAmount: totalDiskAmount,
  };
}

export const useCpuInfo = (): Cpu[] => {
  const [ cpus, setCpus ] = useState<Cpu[]>([]);
  console.trace("states", { cpus });

  const fetchCpuInfo = async () => {
    console.log("Fetching cpu info...");
    const cpuInfo: Cpu[] = await invoke('get_cpu_info');
    console.trace("cpu info", cpuInfo);
    return cpuInfo;
  };

  useEffect(() => {
    fetchCpuInfo().then((val) => setCpus(val));
  }, []);

  return cpus;
}

export const useDiskInfo = (): Disk[] => {
  const [ disks, setDisks ] = useState<Disk[]>([]);
  console.trace("states", { disks });

  const fetchDiskInfo = async () => {
    console.log("Fetching disk info...");
    const diskInfo: Disk[] = await invoke('get_disk_info');
    console.trace("disk info", diskInfo);
    return diskInfo;
  };

  useEffect(() => {
    fetchDiskInfo().then((val) => setDisks(val));
  }, []);

  return disks;
}