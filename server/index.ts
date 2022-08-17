import { Socket, createSocket, RemoteInfo } from "node:dgram";
import "dotenv/config";
import { TextEncoder } from "util";
import { Salsa20 } from "./salsa20";
import { gt7parser } from "./parser";

//Below setup to fetch data from the ps4
const socket: Socket = createSocket("udp4");
const bindPort: number = 33740;
const receivePort: number = 33739;
const psIp: string = process.env.PLAYSTAION_IP;

socket.on("error", (err) => {
  console.log(`server error:\n${err.stack}`);
  socket.close();
});

socket.on("message", (data: Buffer, rinfo: RemoteInfo) => {
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
      console.log(message);
    }
  }
});

socket.on("listening", () => {
  const address = socket.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

socket.bind(bindPort);

socket.send(Buffer.from("A"), 0, 1, receivePort, psIp, (err) => {
  if (err) {
    socket.close();
    return;
  }

  console.log("data send!");
});

function decrypt(data: Buffer): Buffer {
  const encoder: TextEncoder = new TextEncoder();
  const key: Uint8Array = encoder.encode(
    "Simulator Interface Packet GT7 ver 0.0"
  ); // 32 bytes key

  const nonce1: number = data.readInt32LE(64);
  const nonce2: number = nonce1 ^ 0xdeadbeaf;

  const nonce: Buffer = Buffer.alloc(8);
  nonce.writeInt32LE(nonce2);
  nonce.writeInt32LE(nonce1, 4);

  const message: Uint8Array = new Salsa20(key.slice(0, 32), nonce).decrypt(
    data
  );

  const newBuffer: Buffer = Buffer.alloc(message.byteLength);
  for (var i = 0; i < message.length; i++) newBuffer[i] = message[i];

  return newBuffer;
}
