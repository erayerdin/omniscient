// Copyright (c) 2023 Eray Erdin
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { invoke } from "@tauri-apps/api";
import { useEffect, useState } from "react";

export const useOverviewInfo = (): OverviewInfo => {
  const [ currentCpuUsage, setCurrentCpuUsage ] = useState<number>(0);
  const [ currentMemoryUsage, setCurrentMemoryUsage ] = useState<number>(0);
  const [ totalMemoryAmount, setTotalMemoryAmount ] = useState<number>(0);
  const [ currentDiskUsage, setCurrentDiskUsage ] = useState(0);
  const [ totalDiskAmount, setTotalDiskAmount ] = useState(0);

  const fetchCpuUsage = async () => {
    const cpuUsage: number = await invoke('get_cpu_usage');;
    return cpuUsage;
  };

  const fetchMemoryUsage = async () => {
    const memoryUsage: number = await invoke('get_memory_usage');
    return memoryUsage / (1024 * 1024 * 1024);
  };

  const fetchTotalMemoryAmount = async () => {
    const totalMemory: number = await invoke('get_total_memory');
    return totalMemory / (1024 * 1024 * 1024);
  };

  const fetchCurrentDiskUsage = async () => {
    const diskUsage: number = await invoke('get_disk_usage');
    return diskUsage / (1024 * 1024 * 1024);
  };

  const fetchTotalDiskAmount = async () => {
    const totalDisk: number = await invoke('get_total_disk');
    return totalDisk / (1024 * 1024 * 1024);
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
    return () => clearInterval(interval);
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

  const fetchCpuInfo = async () => {
    const cpuInfo: Cpu[] = await invoke('get_cpu_info');
    return cpuInfo;
  };

  useEffect(() => {
    fetchCpuInfo().then((val) => setCpus(val));
  }, []);

  return cpus;
}

export const useDiskInfo = (): Disk[] => {
  const [ disks, setDisks ] = useState<Disk[]>([]);

  const fetchDiskInfo = async () => {
    const diskInfo: Disk[] = await invoke('get_disk_info');
    return diskInfo;
  };

  useEffect(() => {
    fetchDiskInfo().then((val) => setDisks(val));
  }, []);

  return disks;
}