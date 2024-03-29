// Copyright (c) 2023 Eray Erdin
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

use serde::Serialize;
use thiserror::Error;
use wrappers::SetLoggerErrorWrapper;

pub mod cli;
pub mod commands;
pub mod logging;
pub(crate) mod models;
pub mod states;
mod wrappers;

#[derive(Debug, Error, Serialize)]
pub enum OmniscientError {
    #[error("Failed to initialize logging. {0}")]
    LoggingInitError(SetLoggerErrorWrapper),
    #[error("RwLock failed to lock.")]
    RwLockError,
    #[error("Failed to convert {from} to {to}.")]
    TypeConversionError {
        from: &'static str,
        to: &'static str,
    },
}
