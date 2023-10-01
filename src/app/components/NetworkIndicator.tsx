// Copyright (c) 2023 Eray Erdin
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import ArrowSmallDown from "@/components/icons/ArrowSmallDown";
import ArrowSmallUp from "@/components/icons/ArrowSmallUp";
import { Card, CardBody } from "@nextui-org/react";
import { invoke } from "@tauri-apps/api";
import { useEffect, useState } from "react";

type NetworkCardProps = {
  bytes: number,
  isDownload?: boolean,
}

const NetworkCard = ({ bytes, isDownload }: NetworkCardProps) => {
  const kilobytes = bytes / 1024;
  const megabytes = kilobytes / 1024;
  const gigabytes = megabytes / 1024;
  
  let humanReadable: string;
  let measureType: "kbps" | "mbps" | "gbps";

  humanReadable = kilobytes.toFixed(2);
  measureType = "kbps";

  if (kilobytes > 1024) {
    humanReadable = megabytes.toFixed(2);
    measureType = "mbps";
  }
  
  if (megabytes > 1024) {
    humanReadable = gigabytes.toFixed(2);
    measureType = "gbps";
  }

  return (
    <Card>
      <CardBody className="flex w-40">
        {
          isDownload
            ? <ArrowSmallDown />
            : <ArrowSmallUp />
        }
        <span>
          {humanReadable} {measureType}
        </span>
      </CardBody>
    </Card>
  );
}

const NetworkIndicator = () => {
  const [ receivedBytes, setReceivedBytes ] = useState<number>(0);
  const [ transmittedBytes, setTransmittedBytes ] = useState<number>(0);
  console.trace("state", { receivedBytes, transmittedBytes });

  const fetchReceivedBytes = async () => {
    console.log("Fetching received bytes...");
    const amount: number = await invoke('get_network_received_usage');
    console.trace("received bytes", amount);
    return amount;
  }

  const fetchTransmittedBytes = async () => {
    console.log("Fetching received bytes...");
    const amount: number = await invoke('get_network_transmitted_usage');
    console.trace("transmitted bytes", amount);
    return amount;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      Promise.all([fetchReceivedBytes(), fetchTransmittedBytes()]).then((val) => {
        const [ receivedBytes, transmittedBytes ] = val;
        setReceivedBytes(receivedBytes);
        setTransmittedBytes(transmittedBytes);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [receivedBytes, transmittedBytes]);

  return (
    <div className="flex space-x-2">
      <NetworkCard isDownload bytes={receivedBytes} />
      <NetworkCard bytes={transmittedBytes} />
    </div>
  )
}

export default NetworkIndicator