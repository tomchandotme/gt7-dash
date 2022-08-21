import styled from "styled-components";
import { useSocket } from "../hooks/useSocket";
import { Flags } from "../model";

const Container = styled.div`
  background-color: #111;
  color: #eee;
  font-size: 5rem;
  font-weight: 500;
  font-variant: tabular-nums;

  aspect-ratio: 16 / 9;
  width: calc(100vmin * 16 / 9);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  overflow: hidden;
`;

const Flex = styled.div<{ backgroundColor?: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  position: relative;
  background-color: ${(props) => props.backgroundColor || "unset"};

  transition: all 0.1s;
`;

const Row = styled(Flex)<{ size?: number }>`
  width: 100%;
  flex: ${(props) => props.size ?? 1} 0;
  flex-direction: row;
`;

const Col = styled(Flex)<{ size?: number }>`
  height: 100%;
  flex: ${(props) => props.size ?? 1} 0;
  flex-direction: column;
`;

const SpeedMeter = styled(Col)`
  font-weight: 700;
  font-size: 12rem;
`;

const Gear = styled(Col)`
  font-weight: 700;
  font-size: 20rem;
`;

const Label = styled.div<{ position: "top" | "bottom" }>`
  position: absolute;
  top: ${(props) => (props.position === "top" ? "0" : "unset")};
  bottom: ${(props) => (props.position === "bottom" ? "0" : "unset")};
  height: 33%;
  font-size: 2.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
`;

const BarWrapper = styled.div`
  border: 0.125rem solid #fff8;
  flex: 0 0 2rem;
  height: calc(100% - 0.125rem * 2);
  justify-content: flex-end;
  display: flex;
  flex-direction: column;
`;

const Bar = ({
  type,
  value = 0,
}: {
  type: "throttle" | "brake";
  value: number;
}) => {
  return (
    <BarWrapper>
      <div
        style={{
          backgroundColor: type === "throttle" ? "white" : "red",
          height: `${(value * 100) / 255}%`,
        }}
      />
    </BarWrapper>
  );
};

const RevBarWrapper = styled.div`
  align-self: flex-start;
  flex: 1;
  height: 50%;

  display: flex;
  flex-direction: column;
`;

const RevBar = ({
  rpm,
  minAlertRPM,
  maxAlertRPM,
}: {
  rpm: number;
  minAlertRPM: number;
  maxAlertRPM: number;
}) => {
  return (
    <RevBarWrapper>
      <div
        style={{
          backgroundColor: rpm > minAlertRPM ? "red" : "white",
          width: `${(rpm / maxAlertRPM) * 100}%`,
          height: "100%",
        }}
      />
    </RevBarWrapper>
  );
};

const timeFormat = (t: number) => {
  if (t <= 0) return `00'00:00`;

  const ms = `${t % 1000}`.padStart(3, "0");
  const ss = `${Math.floor(t / 1000) % 60}`.padStart(2, "0");
  const mm = `${Math.floor(t / 1000 / 60)}`;

  return `${mm}'${ss}:${ms}`;
};

const isFlag = (f = Flags.None, t: Flags) => (f & t) === t;

const Dashboard = () => {
  const { packet } = useSocket();

  return (
    <Container>
      <Row size={0.5}>
        <RevBar
          rpm={packet?.rpmFromClutchToGearbox ?? 0}
          maxAlertRPM={packet?.maxAlertRPM ?? 0}
          minAlertRPM={packet?.minAlertRPM ?? 0}
        />
      </Row>
      <Row>
        <Col>
          <Label position="top">Lap</Label>
          {packet?.lapCount} / {packet?.lapsInRace}
        </Col>
        <Col>{Math.round(packet?.engineRPM ?? 0)}</Col>
        <Col>
          <Label position="top">Best Lap Time</Label>
          {timeFormat(packet?.bestLapTime ?? 0)}
        </Col>
      </Row>
      <Row size={2} backgroundColor="#8882">
        <SpeedMeter>
          {Math.round(((packet?.metersPerSecond ?? 0) * 60 * 60) / 1000)}
          <Label position="bottom">km/h</Label>
        </SpeedMeter>
        <Bar type="brake" value={packet?.brake ?? 0} />
        <Gear size={0.5} backgroundColor="#33cc">
          {packet?.currentGear}
        </Gear>
        <Bar type="throttle" value={packet?.throttle ?? 0} />
        <SpeedMeter size={0.5}>
          {packet?.suggestedGear !== 15 && packet?.suggestedGear}
        </SpeedMeter>
        <Col size={0.5}>
          <Label position="top">Gas Level</Label>
          {Math.round(packet?.gasLevel ?? 0)}
          <Label position="bottom">
            Cap: {Math.round(packet?.gasCapacity ?? 0)}
          </Label>
        </Col>
      </Row>
      <Row size={1.5}>
        <Col></Col>
        <Col>
          {isFlag(packet?.flags, Flags.Paused) ? "Pasued" : ""}
          {isFlag(packet?.flags, Flags.LoadingOrProcessing) ? "Loading" : ""}
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
