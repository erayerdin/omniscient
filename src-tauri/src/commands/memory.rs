// Copyright (c) 2023 Eray Erdin
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

use sysinfo::SystemExt;

use crate::{states::system::SystemState, OmniscientError};

#[tauri::command]
pub fn get_memory_usage(system_state: tauri::State<SystemState>) -> Result<u64, OmniscientError> {
    log::debug!("Getting memory usage...");

    let mut system = system_state
        .inner()
        .0
        .write()
        .map_err(|_| OmniscientError::RwLockError)?;

    system.refresh_memory();
    let memory_usage = system.used_memory();
    log::trace!("memory usage: {memory_usage}");

    Ok(memory_usage)
}

#[tauri::command]
pub fn get_total_memory(system_state: tauri::State<SystemState>) -> Result<u64, OmniscientError> {
    log::debug!("Getting total memory...");

    let system = system_state
        .inner()
        .0
        .read()
        .map_err(|_| OmniscientError::RwLockError)?;

    let total_memory = system.total_memory();
    log::trace!("total memory: {total_memory}");

    Ok(total_memory)
}
