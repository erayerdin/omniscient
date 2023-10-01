// Copyright (c) 2023 Eray Erdin
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use app::{
    cli::Cli, commands::cpu::*, commands::disk::*, commands::memory::*, commands::network::*,
    logging::init_logger, states::system::SystemState,
};
use clap::Parser;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let cli = Cli::try_parse()?;
    init_logger(cli)?;

    tauri::Builder::default()
        .manage(SystemState::default())
        .invoke_handler(tauri::generate_handler![
            get_cpu_usage,
            get_cpu_info,
            get_memory_usage,
            get_total_memory,
            get_disk_usage,
            get_total_disk,
            get_disk_info,
            get_network_received_usage,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    Ok(())
}
