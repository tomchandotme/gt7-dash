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
    font-size: calc((100vh) * 16 / 9 / 1920 * 16);
  }

  @media (orientation: landscape) {
    :root {
      font-size: calc((100vh) * 16 / 9 / 1920 * 16);
    }
  }

  @media (orientation: landscape) and (max-aspect-ratio: 16 / 9) {
    :root {
      font-size: calc((100vw) * 9 / 16 / 1080 * 16);
    }
  }

  @media (orientation: portrait) {
    :root {
      font-size: calc((100vw) * 9 / 16 / 1080 * 16);
    }
  }
`;

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

  > div {
    font-size: 10rem;
    background: #a44;
    line-height: 1;
    border-radius: 1rem;
    padding: 1rem;
  }
`;

const Label = styled.div<{ position: "top" | "bottom" }>`
  position: absolute;
  top: ${(props) => (props.position === "top" ? "0" : "unset")};
  bottom: ${(props) => (props.position === "bottom" ? "0" : "unset")};
  height: 40%;
  font-size: 2.5rem;
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
  value?: number;
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
  position: relative;

  /* align-self: flex-start; */
  flex: 1;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
`;
const RevBarInner = styled.div`
  height: 100%;
  transition: all 0.05ms;
`;
const FuelText = styled.div`
  position: absolute;

  font-size: 2.75rem;
  font-weight: 700;
  color: #fff;
  /* filter: drop-shadow(0 0.15rem 0.1rem #000c) drop-shadow(0 -0.15rem 0.1rem #000c); */
`;

const RevBar = ({
  rpm = 0,
  minAlertRPM = 0,
  maxAlertRPM = 0,
  isAlert,
}: {
  rpm?: number;
  minAlertRPM?: number;
  maxAlertRPM?: number;
  isAlert?: boolean;
}) => {
  const rpmRange = 1000;
  const width = rpm - (minAlertRPM - rpmRange);
  return (
    <RevBarWrapper>
      <RevBarInner
        style={{
          backgroundColor: rpm > minAlertRPM || isAlert ? "red" : "white",
          width: `${((width > 0 ? width : 0) / rpmRange) * 100}%`,
        }}
      />
    </RevBarWrapper>
  );
};
const FuelBarWrapper = styled(RevBarWrapper)<{ isRed: boolean }>`
  background-color: ${(props) => (props.isRed ? "#c444" : "#000")};
`;
const FuelBarInner = styled(RevBarInner)<{ isRed: boolean }>`
  background-color: ${(props) => (props.isRed ? "#c444" : "#fff4")};
`;
const FuelBar = ({
  gasLevel = 0,
  gasCapacity = 0,
}: {
  gasLevel?: number;
  gasCapacity?: number;
}) => {
  return (
    <>
      <FuelBarWrapper isRed={gasLevel / gasCapacity <= 0.25}>
        {gasCapacity > 0 && (
          <FuelBarInner
            isRed={gasLevel / gasCapacity <= 0.25}
            style={{
              width: `${(gasLevel / gasCapacity) * 100}%`,
            }}
          />
        )}
      </FuelBarWrapper>
      <FuelText>
        {((gasLevel / (gasCapacity || 100)) * 100).toFixed(2)}%
      </FuelText>
    </>
  );
};

const TireTempertureWrapper = styled(Col)`
  font-size: 3rem;

  gap: 2rem;
  padding: 2rem;

  > div {
    gap: 2rem;
  }
`;
const TireCell = ({ temperture = 0 }: { temperture?: number }) => {
  const opacityInHex = (
    (Math.max(0, Math.min(temperture - 50, 100)) / 100) *
    255
  )
    .toString(16)
    .slice(0, 2);
  const backgroundColor = `#cc4444${opacityInHex}`;

  return (
    <Col style={{ borderRadius: "0.5rem", width: "8rem", backgroundColor }}>
      {temperture.toFixed()}
    </Col>
  );
};
const TireTemperture = ({
  tireSurfaceTemperature = {
    FrontLeft: 0,
    FrontRight: 0,
    RearLeft: 0,
    RearRight: 0,
  },
}: {
  tireSurfaceTemperature?: WheelData;
}) => {
  return (
    <TireTempertureWrapper>
      <Row>
        <Col>
          <TireCell temperture={tireSurfaceTemperature.FrontLeft} />
        </Col>
        <Col>
          <TireCell temperture={tireSurfaceTemperature.FrontRight} />
        </Col>
      </Row>
      <Row>
        <Col>
          <TireCell temperture={tireSurfaceTemperature.RearLeft} />
        </Col>
        <Col>
          <TireCell temperture={tireSurfaceTemperature.RearLeft} />
        </Col>
      </Row>
    </TireTempertureWrapper>
  );
};

const FlagsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 20rem);
  gap: 1rem;
  padding: 1rem;
`;

const FlagLabel = styled.span`
  text-align: center;
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1;
  margin: 0.5rem;
  padding: 0.5rem 0.5rem;
  border-radius: 1rem;
  background-color: #fff;
  color: #000;
`;

export const Dash = () => {
  const { packet } = useSocket();

  return (
    <>
      <GlobalStyle />
      <Container>
        <Row size={0.25}>
          <RevBar
            rpm={packet?.engineRPM}
            maxAlertRPM={packet?.maxAlertRPM}
            minAlertRPM={packet?.minAlertRPM}
            isAlert={isFlag(packet?.flags, Flags.RevLimiterBlinkAlertActive)}
          />
        </Row>
        <Row>
          <Col>
            <Label position="top">Lap</Label>
            {packet?.lapCount} / {totalLapCountFormat(packet?.lapsInRace)}
          </Col>
          <Col>{Math.round(packet?.engineRPM ?? 0)}</Col>
          <Col>
            <Label position="top">Best Lap Time</Label>
            {timeFormat(packet?.bestLapTime)}
            <Label position="bottom">
              Last: {timeFormat(packet?.lastLapTime)}
            </Label>
          </Col>
        </Row>
        <Row size={2} backgroundColor="#8882">
          <SpeedMeter>
            {Math.round(((packet?.metersPerSecond ?? 0) * 60 * 60) / 1000)}
            <Label position="bottom">km/h</Label>
          </SpeedMeter>
          <Bar type="brake" value={packet?.brake} />
          <Gear size={0.5} backgroundColor="#33cc">
            {gearFormat(packet?.currentGear)}
          </Gear>
          <Bar type="throttle" value={packet?.throttle} />
          <Gear size={0.35}>
            {packet?.suggestedGear && packet?.suggestedGear !== 15 && (
              <div>{packet?.suggestedGear}</div>
            )}
          </Gear>
          <Col size={0.65}>
            <TireTemperture
              tireSurfaceTemperature={packet?.tireSurfaceTemperature}
            />
          </Col>
        </Row>
        <Row size={1.25}>
          {/* <Col /> */}
          <Col size={2}>
            <FlagsGrid>
              {flagsToValues(packet?.flags).map((f) => (
                <FlagLabel key={f}>{f}</FlagLabel>
              ))}
            </FlagsGrid>
          </Col>
          {/* <Col /> */}
        </Row>
        <Row size={0.25}>
          <FuelBar
            gasLevel={packet?.gasLevel}
            gasCapacity={packet?.gasCapacity}
          />
        </Row>
      </Container>
    </>
  );
};
