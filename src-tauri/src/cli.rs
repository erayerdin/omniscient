// Copyright (c) 2023 Eray Erdin
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

use clap::Parser;

#[derive(Debug, Parser)]
pub struct Cli {
    #[clap(flatten)]
    verbose: clap_verbosity_flag::Verbosity,
}

impl Cli {
    pub fn verbosity(&self) -> &clap_verbosity_flag::Verbosity {
        &self.verbose
    }
}
