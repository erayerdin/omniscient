// Copyright (c) 2023 Eray Erdin
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

use sysinfo::{NetworkExt, SystemExt};

use crate::{states::system::SystemState, OmniscientError};

#[tauri::command]
pub fn get_network_received_usage(
    system_state: tauri::State<SystemState>,
) -> Result<u64, OmniscientError> {
    log::debug!("Getting CPU usage...");

    let mut system = system_state
        .inner()
        .0
        .lock()
        .map_err(|_| OmniscientError::MutexLockError)?;

    system.refresh_networks();
    system.refresh_networks_list();

    let networks = system.networks();
    log::trace!("networks: {networks:?}");

    let usage = networks.into_iter().map(|(_, n)| n.received()).sum();
    log::trace!("usage: {usage}");

    Ok(usage)
}
