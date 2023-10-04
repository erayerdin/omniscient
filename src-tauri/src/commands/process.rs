// Copyright (c) 2023 Eray Erdin
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

use sysinfo::SystemExt;

use crate::{models::process::Process, states::system::SystemState, OmniscientError};

#[tauri::command]
pub fn get_processes(
    system_state: tauri::State<SystemState>,
) -> Result<Vec<Process>, OmniscientError> {
    log::debug!("Listing processes...");

    let mut system = system_state
        .inner()
        .0
        .lock()
        .map_err(|_| OmniscientError::MutexLockError)?;

    system.refresh_processes();

    let processes = system.processes().into_iter().map(Process::from);
    Ok(processes.collect())
}
