import { useSocket } from "../hooks/useSocket";

const Dashboard = () => {
  const { packet } = useSocket();

  return (
    <div>
      <p>current packet id: {packet?.packetId}</p>
      <p>speed {((packet?.metersPerSecond ?? 0) * 60 * 60) / 1000}</p>
    </div>
  );
};

export default Dashboard;
