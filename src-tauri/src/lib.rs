// Copyright (c) 2023 Eray Erdin
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

use thiserror::Error;

#[derive(Debug, Error)]
pub enum OmniscientError {
    #[error("Failed to initialize logging. {0}")]
    LoggingInitError(fern::InitError),
}
