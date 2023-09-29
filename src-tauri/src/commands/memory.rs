// Copyright (c) 2023 Eray Erdin
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

use sysinfo::SystemExt;

use crate::{states::system::SystemState, OmniscientError};

#[tauri::command]
pub fn get_memory_usage(system_state: tauri::State<SystemState>) -> Result<u64, OmniscientError> {
    let mut system = system_state
        .inner()
        .0
        .lock()
        .map_err(|_| OmniscientError::MutexLockError)?;

    system.refresh_memory();
    Ok(system.used_memory())
}

#[tauri::command]
pub fn get_total_memory(system_state: tauri::State<SystemState>) -> Result<u64, OmniscientError> {
    let mut system = system_state
        .inner()
        .0
        .lock()
        .map_err(|_| OmniscientError::MutexLockError)?;

    system.refresh_memory();
    Ok(system.total_memory())
}
