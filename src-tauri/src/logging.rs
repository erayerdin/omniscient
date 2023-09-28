// Copyright (c) 2023 Eray Erdin
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

use std::time::SystemTime;

use crate::{cli::Cli, OmniscientError};

pub fn init_logger(cli: &Cli) -> Result<(), OmniscientError> {
    fern::Dispatch::new()
        .format(|out, message, record| {
            out.finish(format_args!(
                "[{} {} {}] {}",
                humantime::format_rfc3339_seconds(SystemTime::now()),
                record.level(),
                record.target(),
                message
            ))
        })
        .level(cli.verbosity().log_level_filter())
        .chain(std::io::stdout())
        .apply()
        .map_err(|e| OmniscientError::LoggingInitError(e))?;
    Ok(())
}
