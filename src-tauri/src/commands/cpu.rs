// Copyright (c) 2023 Eray Erdin
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

use sysinfo::{CpuExt, SystemExt};

use crate::{models::cpu::Cpu, states::system::SystemState, OmniscientError};

#[tauri::command]
pub fn get_cpu_usage(system_state: tauri::State<SystemState>) -> Result<f32, OmniscientError> {
    log::debug!("Getting CPU usage...");

    let mut system = system_state
        .inner()
        .0
        .lock()
        .map_err(|_| OmniscientError::MutexLockError)?;

    system.refresh_cpu();

    let cpus = system.cpus();
    log::trace!("cpus: {cpus:?}");

    let usage = cpus.iter().map(|cpu| cpu.cpu_usage()).sum::<f32>() / cpus.len() as f32;
    log::trace!("cpu usage: {usage}");

    Ok(usage)
}

#[tauri::command]
pub fn get_cpu_info(system_state: tauri::State<SystemState>) -> Result<Vec<Cpu>, OmniscientError> {
    log::debug!("Getting CPU info...");

    let mut system = system_state
        .inner()
        .0
        .lock()
        .map_err(|_| OmniscientError::MutexLockError)?;

    system.refresh_cpu();

    let cpus = system.cpus();
    log::trace!("cpus: {cpus:?}");

    let cpus_vec: Vec<Cpu> = Vec::with_capacity(cpus.len());
    Ok(cpus_vec)
}
