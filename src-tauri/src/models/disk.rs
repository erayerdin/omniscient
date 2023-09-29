// Copyright (c) 2023 Eray Erdin
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

use std::path::PathBuf;

use serde::Serialize;
use sysinfo::DiskExt;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Disk {
    r#type: Option<DiskType>,
    name: String,
    file_system: String,
    mount_point: PathBuf,
    available_space: u64,
    total_space: u64,
    is_removable: bool,
}

#[derive(Debug)]
pub enum DiskType {
    HDD,
    SSD,
}

impl Serialize for DiskType {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(match self {
            DiskType::HDD => "HDD",
            DiskType::SSD => "SSD",
        })
    }
}

impl From<sysinfo::Disk> for Disk {
    fn from(value: sysinfo::Disk) -> Self {
        Self {
            r#type: match value.kind() {
                sysinfo::DiskKind::HDD => Some(DiskType::HDD),
                sysinfo::DiskKind::SSD => Some(DiskType::SSD),
                sysinfo::DiskKind::Unknown(_) => None,
            },
            name: value.name().to_string_lossy().to_string(),
            file_system: String::from_utf8_lossy(value.file_system()).to_string(),
            mount_point: value.mount_point().to_path_buf(),
            available_space: value.available_space(),
            total_space: value.total_space(),
            is_removable: value.is_removable(),
        }
    }
}
