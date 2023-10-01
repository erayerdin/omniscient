// Copyright (c) 2023 Eray Erdin
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

use std::fmt;

use serde::Serialize;

#[derive(Debug)]
pub struct SetLoggerErrorWrapper(pub log::SetLoggerError);

impl Serialize for SetLoggerErrorWrapper {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(&self.0.to_string())
    }
}

impl fmt::Display for SetLoggerErrorWrapper {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&self.0.to_string())
    }
}

impl From<log::SetLoggerError> for SetLoggerErrorWrapper {
    fn from(value: log::SetLoggerError) -> Self {
        Self(value)
    }
}
