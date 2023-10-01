// Copyright (c) 2023 Eray Erdin
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

type OverviewInfo = {
  currentCpuUsage: number,
  currentMemoryUsage: number,
  totalMemoryAmount: number,
  currentDiskUsage: number,
  totalDiskAmount: number,
}

type Cpu = {
  name: string,
  brand: string,
  vendorId: string,
  frequency: number,
}

type Disk = {
  type: "HDD" | "SSD" | null,
  name: string,
  fileSystem: string,
  mountPoint: string,
  availableSpace: number,
  totalSpace: number,
  isRemovable: boolean,
}

type Metadata = {
  name: string,
  version: string,
  description: string,
  authors: string[],
  repositoryUrl: string,
  license: string,
}