// Copyright (c) 2023 Eray Erdin
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Queue } from "@datastructures-js/queue";
import { colors } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";


const NetworkIndicator = () => {
  const [ receivedBytesQueue, setReceivedBytesQueue ] = useState<Queue<number>>(Queue.fromArray(Array(20).fill(0)));
  const [ transmittedBytesQueue, setTransmittedBytesQueue ] = useState<Queue<number>>(Queue.fromArray(Array(20).fill(0)));
  console.trace("state", { receivedBytesQueue, transmittedBytesQueue });

  const fetchReceivedBytes = async () => {
    console.log("Fetching received bytes...");
    const random = Math.random() * (8 * 1024 * 1024 * 1024);
    console.trace("received bytes", random);
    return random;
  }

  const fetchTransmittedBytes = async () => {
    console.log("Fetching received bytes...");
    const random = Math.random() * (8 * 1024 * 1024 * 1024);
    console.trace("received bytes", random);
    return random;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      Promise.all([fetchReceivedBytes(), fetchTransmittedBytes()]).then((val) => {
        const [ receivedBytes, transmittedBytes ] = val;

        receivedBytesQueue.push(receivedBytes);
        receivedBytesQueue.pop();
        transmittedBytesQueue.push(transmittedBytes);
        transmittedBytesQueue.pop();

        setReceivedBytesQueue(_ => receivedBytesQueue);
        setTransmittedBytesQueue(_ => transmittedBytesQueue);
      });
    });

    return () => clearInterval(interval);
  }, [receivedBytesQueue, transmittedBytesQueue]);

  const receivedMegabytesArray = receivedBytesQueue.toArray().map(bytes => bytes / (1024 * 1024));
  const transmittedMegabytesArray = transmittedBytesQueue.toArray().map(bytes => bytes / (1024 * 1024));

  return (
    <div className="flex flex-col">
      <Line
        width={750}
        height={350}
        data={{
          datasets: [
            {
              label: "Download",
              borderColor: colors.blue[500],
              data: receivedMegabytesArray,
            },
            {
              label: "Upload",
              borderColor: colors.green[500],
              data: transmittedMegabytesArray,
            },
          ],
          labels: Array<string>(20).fill('0').map((_, i) => `${i}s`),
        }}
      />
    </div>
  )
}

export default NetworkIndicator