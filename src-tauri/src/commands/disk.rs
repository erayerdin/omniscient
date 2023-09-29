// Copyright (c) 2023 Eray Erdin
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

use sysinfo::{DiskExt, SystemExt};

use crate::{states::system::SystemState, OmniscientError};

#[tauri::command]
pub fn get_disk_usage(system_state: tauri::State<SystemState>) -> Result<u64, OmniscientError> {
    let mut system = system_state
        .inner()
        .0
        .lock()
        .map_err(|_| OmniscientError::MutexLockError)?;

    system.refresh_disks();
    system.refresh_disks_list();
    let disk_usage = system
        .disks()
        .into_iter()
        .filter(|d| !d.is_removable())
        .map(|d| d.available_space())
        .sum();

    Ok(disk_usage)
}

#[tauri::command]
pub fn get_total_disk(system_state: tauri::State<SystemState>) -> Result<u64, OmniscientError> {
    let mut system = system_state
        .inner()
        .0
        .lock()
        .map_err(|_| OmniscientError::MutexLockError)?;

    system.refresh_disks();
    system.refresh_disks_list();
    let total_disk = system
        .disks()
        .into_iter()
        .filter(|d| !d.is_removable())
        .map(|d| d.total_space())
        .sum();

    Ok(total_disk)
}
