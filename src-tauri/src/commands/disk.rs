// Copyright (c) 2023 Eray Erdin
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

use sysinfo::{DiskExt, SystemExt};

use crate::{states::system::SystemState, OmniscientError};

#[tauri::command]
pub fn get_disk_usage(system_state: tauri::State<SystemState>) -> Result<u64, OmniscientError> {
    log::debug!("Getting disk usage...");

    let mut system = system_state
        .inner()
        .0
        .lock()
        .map_err(|_| OmniscientError::MutexLockError)?;

    system.refresh_disks();
    system.refresh_disks_list();
    let disks = system
        .disks()
        .into_iter()
        .filter(|d| !d.is_removable())
        .filter_map(|d| match d.kind() {
            sysinfo::DiskKind::Unknown(_) => None,
            _ => Some(d),
        });
    log::trace!("not removable known disks: {disks:?}");

    let disk_usage = disks.map(|d| d.available_space()).sum();
    log::trace!("disk usage: {disk_usage}");

    Ok(disk_usage)
}

#[tauri::command]
pub fn get_total_disk(system_state: tauri::State<SystemState>) -> Result<u64, OmniscientError> {
    log::debug!("Getting total disk...");

    let mut system = system_state
        .inner()
        .0
        .lock()
        .map_err(|_| OmniscientError::MutexLockError)?;

    system.refresh_disks();
    system.refresh_disks_list();

    let disks = system
        .disks()
        .into_iter()
        .filter(|d| !d.is_removable())
        .filter_map(|d| match d.kind() {
            sysinfo::DiskKind::Unknown(_) => None,
            _ => Some(d),
        });
    log::trace!("not removable known disks: {disks:?}");

    let total_disk = disks.map(|d| d.total_space()).sum();
    log::trace!("total disk: {total_disk}");

    Ok(total_disk)
}
