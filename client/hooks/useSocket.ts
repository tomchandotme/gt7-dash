import { useState, useEffect } from "react";
import io from "socket.io-client";
import { SimulatorPacket } from "../model";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_IP || "127.0.0.1:9527");

export const useSocket = () => {
  const [packet, setPacket] = useState<SimulatorPacket | undefined>();

  useEffect(() => {
    socket.on("message", (data: SimulatorPacket) => {
      // console.log(data);
      setPacket(data);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  return { packet };
};
