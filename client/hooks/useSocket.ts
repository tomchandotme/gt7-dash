import { useState, useEffect } from "react";
import io from "socket.io-client";
import { SimulatorPacket } from "../model";

const socket = io("localhost:9527");

export const useSocket = () => {
  const [packet, setPacket] = useState<SimulatorPacket | undefined>();

  useEffect(() => {
    socket.on("message", (data: SimulatorPacket) => {
      console.log(data);
      setPacket(data);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  return { packet };
};
