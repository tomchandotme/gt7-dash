import { Socket, createSocket, RemoteInfo } from "node:dgram";
import { Server } from "socket.io";
import "dotenv/config";

import { gt7parser } from "./parser";
import { decrypt } from "./utils";

// MARK: Setup

const udpSocket: Socket = createSocket("udp4");
const bindPort: number = 33740;
const receivePort: number = 33739;
const psIp: string = process.env.PLAYSTAION_IP;
const ioPort = 9527;

const io = new Server({
  /* options */
});

// MARK: web socket (communication to dashboard client)

io.on("connection", (socket) => {
  // ...
});

io.listen(ioPort);

// MARK: UDP Socket (communication to PS4/5)

udpSocket.on("error", (err) => {
  console.log(`server error:\n${err.stack}`);
  udpSocket.close();
});

udpSocket.on("message", (data: Buffer, rinfo: RemoteInfo) => {
  // console.log(`server got: ${data.length} from ${rinfo.address}:${rinfo.port}`);

  if (0x128 === data.length) {
    const packet: Buffer = decrypt(data);

    const magic = packet.readInt32LE();
    if (magic != 0x47375330) {
      // 0S7G - G7S0
      console.log("Magic! error!", magic);
    } else {
      const message = gt7parser.parse(packet);

      // console.clear();
      // console.log(message);
    }
  }
});

udpSocket.on("listening", () => {
  const address = udpSocket.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

udpSocket.bind(bindPort);

udpSocket.send(Buffer.from("A"), 0, 1, receivePort, psIp, (err) => {
  if (err) {
    udpSocket.close();
    return;
  }

  console.log("data send!");
});
