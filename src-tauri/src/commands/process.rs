// Copyright (c) 2023 Eray Erdin
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

use sysinfo::SystemExt;

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
        .lock()
        .map_err(|_| OmniscientError::MutexLockError)?;

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
            ProcessSortDirection::Ascending => a.path().cmp(b.path()),
            ProcessSortDirection::Descending => b.path().cmp(a.path()),
        },
        ProcessColumn::CpuUsage => match direction {
            ProcessSortDirection::Ascending => a.cpu_usage.total_cmp(&b.cpu_usage),
            ProcessSortDirection::Descending => b.cpu_usage.total_cmp(&a.cpu_usage),
        },
        ProcessColumn::MemoryUsage => match direction {
            ProcessSortDirection::Ascending => a.memory_usage.cmp(&b.memory_usage),
            ProcessSortDirection::Descending => b.memory_usage.cmp(&a.memory_usage),
        },
    });

    Ok(processes)
}
