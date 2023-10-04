// Copyright (c) 2023 Eray Erdin
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

use serde::{Deserialize, Serialize};
use sysinfo::{PidExt, ProcessExt};

use crate::OmniscientError;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Process {
    pid: u32,
    path: String,
    pub cpu_usage: f32,
    pub memory_usage: u64,
}

impl Process {
    pub fn path(&self) -> &str {
        self.path.as_ref()
    }
}

impl TryFrom<(&sysinfo::Pid, &sysinfo::Process, usize)> for Process {
    type Error = OmniscientError;

    fn try_from(
        (pid, process, core_count): (&sysinfo::Pid, &sysinfo::Process, usize),
    ) -> Result<Self, Self::Error> {
        let core_count =
            u8::try_from(core_count).map_err(|_| OmniscientError::TypeConversionError {
                from: "usize",
                to: "u8",
            })?;

        Ok(Process {
            pid: pid.as_u32(),
            path: String::from(process.exe().to_path_buf().to_string_lossy()),
            cpu_usage: process.cpu_usage() / f32::from(core_count),
            memory_usage: process.memory(),
        })
    }
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProcessSortDescriptor {
    pub column: ProcessColumn,
    pub direction: ProcessSortDirection,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum ProcessColumn {
    Path,
    CpuUsage,
    MemoryUsage,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum ProcessSortDirection {
    Ascending,
    Descending,
}
