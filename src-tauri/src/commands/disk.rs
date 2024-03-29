// Copyright (c) 2023 Eray Erdin
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

use sysinfo::{DiskExt, SystemExt};

use crate::{models::disk::Disk, states::system::SystemState, OmniscientError};

#[tauri::command]
pub fn get_disk_usage(system_state: tauri::State<SystemState>) -> Result<u64, OmniscientError> {
    log::debug!("Getting disk usage...");

    let system = system_state
        .inner()
        .0
        .read()
        .map_err(|_| OmniscientError::RwLockError)?;

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

    let system = system_state
        .inner()
        .0
        .read()
        .map_err(|_| OmniscientError::RwLockError)?;

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

#[tauri::command]
pub fn get_disk_info(
    system_state: tauri::State<SystemState>,
) -> Result<Vec<Disk>, OmniscientError> {
    log::debug!("Getting disk info...");

    let system = system_state
        .inner()
        .0
        .read()
        .map_err(|_| OmniscientError::RwLockError)?;

    let disks = system.disks();
    log::trace!("disks: {disks:?}");

    let mut disks_vec: Vec<Disk> = Vec::with_capacity(disks.len());
    disks_vec.extend(disks.iter().map(|d| d.into()));
    Ok(disks_vec)
}
