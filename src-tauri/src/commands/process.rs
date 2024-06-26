// Copyright (c) 2023 Eray Erdin
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

use sysinfo::{Pid, PidExt, ProcessExt, SystemExt};

use crate::{
    models::process::{Process, ProcessColumn, ProcessSortDescriptor, ProcessSortDirection},
    states::system::SystemState,
    OmniscientError,
};

#[tauri::command]
pub fn get_processes(
    system_state: tauri::State<SystemState>,
    sort_descriptor: ProcessSortDescriptor,
    filter_text: Option<String>,
) -> Result<Vec<Process>, OmniscientError> {
    log::debug!("Listing processes...");
    log::trace!("sort descriptor: {sort_descriptor:?}");
    log::trace!("filter text: {filter_text:?}");

    let ProcessSortDescriptor { column, direction } = sort_descriptor;

    let mut system = system_state
        .inner()
        .0
        .write()
        .map_err(|_| OmniscientError::RwLockError)?;

    system.refresh_processes();

    let mut processes: Vec<Process> = system
        .processes()
        .iter()
        .filter_map(|p| {
            match Process::try_from((p.0, p.1, system.physical_core_count().unwrap_or(1))) {
                Ok(p) => Some(p),
                Err(e) => {
                    log::warn!("An error occured while initializing a process: {e}");
                    None
                }
            }
        })
        .filter(|p| !p.path().is_empty())
        .filter(|p| match filter_text.clone() {
            Some(value) => {
                let val = value.trim().to_lowercase();
                log::trace!("Sanitized filter text: {val}");
                p.path().to_lowercase().contains(&val)
            }
            None => true,
        })
        .collect();

    processes.sort_by(|a, b| match column {
        ProcessColumn::Path => match direction {
            ProcessSortDirection::Ascending => b.path().cmp(a.path()),
            ProcessSortDirection::Descending => a.path().cmp(b.path()),
        },
        ProcessColumn::CpuUsage => match direction {
            ProcessSortDirection::Ascending => b.cpu_usage.total_cmp(&a.cpu_usage),
            ProcessSortDirection::Descending => a.cpu_usage.total_cmp(&b.cpu_usage),
        },
        ProcessColumn::MemoryUsage => match direction {
            ProcessSortDirection::Ascending => b.memory_usage.cmp(&a.memory_usage),
            ProcessSortDirection::Descending => a.memory_usage.cmp(&b.memory_usage),
        },
    });

    Ok(processes)
}

#[tauri::command]
pub fn kill_process(
    system_state: tauri::State<SystemState>,
    pid: u32,
) -> Result<bool, OmniscientError> {
    log::debug!("Killing process...");
    log::trace!("pid: {pid}");

    let system = system_state
        .inner()
        .0
        .read()
        .map_err(|_| OmniscientError::RwLockError)?;

    let process = system.process(Pid::from_u32(pid));

    if process.is_none() {
        return Ok(false);
    }

    let process = process.unwrap();
    let result = process.kill();

    Ok(result)
}
