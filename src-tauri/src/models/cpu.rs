// Copyright (c) 2023 Eray Erdin
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

use serde::Serialize;
use sysinfo::CpuExt;

#[derive(Debug, Serialize)]
pub struct Cpu {
    name: String,
    brand: String,
    vendor_id: String,
    frequency: u64,
}

impl From<sysinfo::Cpu> for Cpu {
    fn from(value: sysinfo::Cpu) -> Self {
        Self {
            name: value.name().into(),
            brand: value.brand().into(),
            vendor_id: value.vendor_id().into(),
            frequency: value.frequency(),
        }
    }
}
