// Copyright (c) 2023 Eray Erdin
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { invoke } from "@tauri-apps/api";
import { useEffect, useState } from "react";

export const useOverviewInfo = (): OverviewInfo => {
  const [ currentCpu, setCurrentCpu ] = useState<number>(0);
  const [ currentMemory, setCurrentMemory ] = useState<number>(0);
  const [ totalMemory, setTotalMemory ] = useState<number>(0);
  const [ currentDisk, setCurrentDisk ] = useState(0);
  const [ totalDisk, setTotalDisk ] = useState(0);

  const fetchCpu = async () => {
    const cpuUsage: number = await invoke('get_cpu_usage');;
    return cpuUsage;
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

  return {
    currentCpu,
    currentMemory,
    totalMemory,
    currentDisk,
    totalDisk,
  };
}