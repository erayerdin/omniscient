// Copyright (c) 2023 Eray Erdin
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

use std::path;

use serde::Serialize;
use sysinfo::{PidExt, ProcessExt};

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Process {
    pid: u32,
    path: path::PathBuf,
    cpu_usage: f32,
    memory_usage: u64,
}

impl From<(&sysinfo::Pid, &sysinfo::Process)> for Process {
    fn from((pid, process): (&sysinfo::Pid, &sysinfo::Process)) -> Self {
        Process {
            pid: pid.as_u32(),
            path: process.exe().to_path_buf(),
            cpu_usage: process.cpu_usage(),
            memory_usage: process.virtual_memory(),
        }
    }
}
