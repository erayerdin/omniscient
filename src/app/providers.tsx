// Copyright (c) 2023 Eray Erdin
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

"use client";

import { NextUIProvider } from "@nextui-org/react";
import { CategoryScale, Chart, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from "chart.js";

// REF https://stackoverflow.com/a/70142666/2926992
const ChartsProvider = ({ children }: { children: React.ReactNode }) => {
  Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  );
  return children;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChartsProvider>
      <NextUIProvider>
        {children}
      </NextUIProvider>
    </ChartsProvider>
  );
}