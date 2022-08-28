import { range } from "lodash";
import { ReactNode } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { useSocket } from "../../hooks/useSocket";
import { Flags, WheelData } from "../../model";
import {
  flagsToValues,
  gearFormat,
  isFlag,
  timeFormat,
  totalLapCountFormat,
} from "../../utils";

const GlobalStyle = createGlobalStyle`
  :root {
    font-size: calc((100vh) * 19 / 10 / 1900 * 10);
  }

  @media (orientation: landscape) {
    :root {
      font-size: calc((100vh) * 19 / 10 / 1900 * 10);
    }
  }

  @media (orientation: landscape) and (max-aspect-ratio: 19 / 10) {
    :root {
      font-size: calc((100vw) * 10 / 19 / 1000 * 10);
    }
  }

  @media (orientation: portrait) {
    :root {
      font-size: calc((100vw) * 10 / 19 / 1000 * 10);
    }
  }
`;

const Container = styled.div`
  background-color: #222;
  color: #eee;
  font-size: 5rem;
  font-weight: 500;
  font-variant: tabular-nums;
  font-family: "Arial", "Helvetica", sans-serif;

  outline: 0.6rem solid #ccc;
  outline-offset: -0.6rem;

  aspect-ratio: 19 / 10;
  width: calc(100vmin * 19 / 10);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  overflow: hidden;

  line-height: 0;
`;

const Flex = styled.div<{ backgroundColor?: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  position: relative;
  background-color: ${(props) => props.backgroundColor || undefined};
`;

const Row = styled(Flex)<{ size?: number }>`
  width: 100%;
  height: 100%;

  flex: ${(props) => props.size ?? 1} 0;
  flex-direction: row;
`;

const Col = styled(Flex)<{ size?: number; noBorder?: boolean }>`
  height: 100%;
  width: 100%;

  flex: ${(props) => props.size ?? 1} 0;
  flex-direction: column;

  outline: ${(props) => (props.noBorder ? "none" : "0.3rem solid #ccc")};
`;

const RPMText = styled(Col)<{ isAlert?: boolean }>`
  font-size: 18rem;
  font-weight: 700;
  color: ${(props) => (props.isAlert ? "#f22" : "unset")};
`;

const RPM = ({
  rpm = 0,
  minAlertRPM = 0,
  maxAlertRPM = 0,
  isAlert,
}: {
  rpm?: number;
  maxAlertRPM?: number;
  minAlertRPM?: number;
  isAlert?: boolean;
}) => {
  return <RPMText isAlert={rpm > minAlertRPM || isAlert}>{rpm}</RPMText>;
};

const Gear = styled(Col).attrs({ size: 5 })`
  font-size: 40rem;
  font-weight: 700;
`;

const Temp = styled(Col)`
  font-size: 17.5rem;
  font-weight: 700;
  color: #f22;
`;

const Time = styled(Col)<{ isBest?: boolean }>`
  font-size: 15rem;
  font-weight: 700;
  color: ${(props) => (props.isBest ? "#c2c" : "#2f2")};
`;

const Speed = styled(Col)`
  font-size: 17.5rem;
  font-weight: 700;
`;

const Lap = styled(Col)`
  font-size: 13rem;
  font-weight: 700;
`;

const LabelInner = styled.div`
  position: absolute;
  font-weight: 700;
  color: #fff;
`;
const Label = ({
  children,
  position = "center-center",
  fontSize = "3rem",
}: {
  children?: ReactNode;
  position?: `${"top" | "center" | "bottom"}-${"left" | "center" | "right"}`;
  fontSize?: string | number;
}) => {
  const [vPos, hPos] = position.split("-");
  const style = {
    fontSize,
    top: vPos === "top" ? `calc(${fontSize} * 0.75 + 0.5rem)` : undefined,
    bottom: vPos === "bottom" ? fontSize : undefined,
    left: hPos === "left" ? "1.5rem" : undefined,
    right: hPos === "right" ? "1.5rem" : undefined,
  };
  return <LabelInner style={style}>{children}</LabelInner>;
};

const FlagsGrid = styled(Col)`
  height: calc(100% - 2.4rem);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.6rem;
  padding: 1.2rem;
`;
const FlagLabel = styled(Flex)`
  height: 100%;
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1;
  /* margin: 0.5rem; */
  /* padding: 0.5rem 0.5rem; */
  /* background-color: #fff8; */
  color: #fff;
`;

const FuelCell = styled(Col)<{ type: "red" | "green" | "none" }>`
  mix-blend-mode: lighten;
  background-color: ${(props) =>
    props.type === "none" ? "none" : props.type === "red" ? "#b22" : "#284"};
`;

const FuelBar = ({
  level = 0,
  capacity = 0,
}: {
  level?: number;
  capacity?: number;
}) => {
  const gasLevel = level / capacity || 100;

  return (
    <>
      {range(20).map((v) => {
        const type = gasLevel <= v / 20 ? "none" : v < 5 ? "red" : "green";
        return <FuelCell type={type} key={`fuel_${v}`} />;
      })}
    </>
  );
};

export const Dash = () => {
  const { packet } = useSocket();

  return (
    <>
      <GlobalStyle />
      <Container>
        <Row size={2}>
          <Time>
            <Label position="top-left">LAST LAP</Label>
            {timeFormat(packet?.lastLapTime)}
          </Time>
          <RPM
            rpm={Math.round(packet?.engineRPM ?? 0)}
            minAlertRPM={packet?.minAlertRPM}
            maxAlertRPM={packet?.maxAlertRPM}
            isAlert={isFlag(packet?.flags, Flags.RevLimiterBlinkAlertActive)}
          />
          <Time isBest>
            <Label position="top-right">BEST LAP</Label>
            {timeFormat(packet?.bestLapTime)}
          </Time>
        </Row>
        <Row size={4}>
          <Col size={4} noBorder>
            <Speed>
              <Label position="top-left">SPEED</Label>
              <div>
                {Math.round(((packet?.metersPerSecond ?? 0) * 60 * 60) / 1000)}
              </div>
            </Speed>
            <Lap>
              <Label position="top-left">LAP</Label>
              {packet?.lapCount} / {totalLapCountFormat(packet?.lapsInRace)}
            </Lap>
          </Col>
          <Col size={3} noBorder>
            <Temp>
              {Math.round(packet?.tireSurfaceTemperature.FrontLeft ?? 0)}
            </Temp>
            <Temp>
              {Math.round(packet?.tireSurfaceTemperature.RearLeft ?? 0)}
            </Temp>
          </Col>
          <Gear>
            <Label position="top-left">GEAR</Label>
            {gearFormat(packet?.currentGear)}
          </Gear>
          <Col size={3} noBorder>
            <Temp>
              {Math.round(packet?.tireSurfaceTemperature.FrontRight ?? 0)}
            </Temp>
            <Temp>
              {Math.round(packet?.tireSurfaceTemperature.RearRight ?? 0)}
            </Temp>
          </Col>
          <Col size={4} noBorder>
            <Col></Col>
            <Col></Col>
          </Col>
        </Row>
        <Row size={2}>
          <FlagsGrid size={6}>
            {flagsToValues(packet?.flags).map((f) => (
              <FlagLabel key={f}>{f}</FlagLabel>
            ))}
          </FlagsGrid>
        </Row>
        <Row size={1}>
          <FuelBar level={packet?.gasLevel} capacity={packet?.gasCapacity} />
        </Row>
      </Container>
    </>
  );
};
