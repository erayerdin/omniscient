// Copyright (c) 2023 Eray Erdin
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Card, CircularProgress } from "@nextui-org/react";

type ResourceCardProps = {
  label: string,
  used: number,
  total: number,
  footer: (used: number, total: number) => React.ReactNode,
  onPress?: () => void,
}

const ResourceCard = ({ label, used, total, footer, onPress }: ResourceCardProps) => {
  const value = used / total;
  const valuePercent = value * 100;

  let color = "danger";

  if (valuePercent < 45) {
    color = "success";
  } else if (valuePercent < 75) {
    color = "primary";
  } else if (valuePercent < 90) {
    color = "warning";
  }

  return (
    <Card onPress={onPress} isPressable={onPress !== null} className="flex p-sm items-center space-y-2 w-64">
      <header className="text-xl">{label}</header>
      <CircularProgress
        size="lg"
        aria-label={label}
        classNames={{
          svg: "w-32 h-32"
        }}
        value={valuePercent}
        color={color as any}
      />
      <footer>{footer(used, total)}</footer>
    </Card>
  );
}

export default ResourceCard