// Copyright (c) 2023 Eray Erdin
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use app::{cli::Cli, logging::init_logger};
use clap::Parser;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let cli = Cli::try_parse()?;
    init_logger(&cli)?;

    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    Ok(())
}
