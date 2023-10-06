// Copyright (c) 2023 Eray Erdin
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

use std::sync::{Arc, Mutex};

use sysinfo::{System, SystemExt};

pub struct SystemState(pub Arc<Mutex<System>>);

impl Default for SystemState {
    fn default() -> Self {
        let mut system = System::new();
        system.refresh_cpu();
        system.refresh_disks_list();
        system.refresh_disks();
        system.refresh_memory();
        Self(Arc::new(Mutex::new(system)))
    }
}
