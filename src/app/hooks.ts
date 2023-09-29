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

  const fetchCpu = async () => {
    const cpuUsage: number = await invoke('get_cpu_usage');;
    return cpuUsage;
  };

  const fetchMemory = async () => {
    const memoryUsage: number = await invoke('get_memory_usage');
    return memoryUsage / (1024 * 1024 * 1024);
  };

  const fetchTotalMemory = async () => {
    const totalMemory: number = await invoke('get_total_memory');
    return totalMemory / (1024 * 1024 * 1024);
  };

  const fetchCurrentDisk = async () => {
    const diskUsage: number = await invoke('get_disk_usage');
    return diskUsage / (1024 * 1024 * 1024);
  };

  const fetchTotalDisk = async () => {
    const totalDisk: number = await invoke('get_total_disk');
    return totalDisk / (1024 * 1024 * 1024);
  };

  useEffect(() => {
    fetchTotalMemory().then((val) => setTotalMemoryAmount(val));
    fetchCurrentDisk().then((val) => setCurrentDiskUsage(val));
    fetchTotalDisk().then((val) => setTotalDiskAmount(val));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchCpu().then((val) => setCurrentCpuUsage(val));
      fetchMemory().then((val) => setCurrentMemoryUsage(val));
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