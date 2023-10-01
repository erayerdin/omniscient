// Copyright (c) 2023 Eray Erdin
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct Metadata<'a> {
    name: &'a str,
    version: &'a str,
    description: &'a str,
    authors: Vec<&'a str>,
    repository_url: &'a str,
    license: &'a str,
}

impl<'a> Default for Metadata<'a> {
    fn default() -> Self {
        Self {
            name: env!("CARGO_PKG_NAME"),
            version: env!("CARGO_PKG_VERSION"),
            description: env!("CARGO_PKG_DESCRIPTION"),
            authors: env!("CARGO_PKG_AUTHORS").split(";").collect(),
            repository_url: env!("CARGO_PKG_REPOSITORY"),
            license: env!("CARGO_PKG_LICENSE"),
        }
    }
}
