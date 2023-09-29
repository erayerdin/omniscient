// Copyright (c) 2023 Eray Erdin
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

use std::sync::{Arc, Mutex};

use sysinfo::{CpuExt, System, SystemExt};

use crate::OmniscientError;

pub struct SystemState(Arc<Mutex<System>>);

impl Default for SystemState {
    fn default() -> Self {
        Self(Arc::new(Mutex::new(System::new())))
    }
}

#[tauri::command]
pub fn get_cpu_usage(system_state: tauri::State<SystemState>) -> Result<f32, OmniscientError> {
    // system.lock().refresh_cpu();
    // let cpus = system.cpus();
    // let usage = cpus.iter().map(|cpu| cpu.cpu_usage()).sum::<f32>() / cpus.len() as f32;
    // usage

    let mut system = system_state
        .inner()
        .clone()
        .0
        .lock()
        .map_err(|e| OmniscientError::MutexLockError)?;

    system.refresh_cpu();
    let cpus = system.cpus();
    let usage = cpus.iter().map(|cpu| cpu.cpu_usage()).sum::<f32>() / cpus.len() as f32;
    Ok(usage)
}
