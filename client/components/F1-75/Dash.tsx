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
      font-size: calc((100vh) * 19 / 10 / 1900 * 19);
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

  transition: all 0.1s;
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

const RPMText = styled(Col)`
  font-size: 15rem;
  font-weight: 700;
`;

const RPM = ({
  rpm = 0,
}: {
  rpm?: number;
  maxAlertRPM?: number;
  minAlertRPM?: number;
  isAlert?: boolean;
}) => {
  return <RPMText>{rpm}</RPMText>;
};

const Gear = styled(Col).attrs({ size: 5 })`
  font-size: 40rem;
  font-weight: 700;
`;

const Temp = styled(Col)`
  font-size: 14rem;
  font-weight: 700;
  color: #f22;
`;

const Time = styled(Col)<{ isBest?: boolean }>`
  font-size: 12rem;
  font-weight: 700;
  color: ${(props) => (props.isBest ? "#c2c" : "#2f2")};
`;

const Speed = styled(Col)`
  font-size: 15rem;
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
  fontSize = "2.5rem",
}: {
  children?: ReactNode;
  position?: `${"top" | "center" | "bottom"}-${"left" | "center" | "right"}`;
  fontSize?: string | number;
}) => {
  const [vPos, hPos] = position.split("-");
  const style = {
    fontSize,
    top: vPos === "top" ? fontSize : undefined,
    bottom: vPos === "bottom" ? fontSize : undefined,
    left: hPos === "left" ? "2.5rem" : undefined,
    right: hPos === "right" ? "2.5rem" : undefined,
  };
  return <LabelInner style={style}>{children}</LabelInner>;
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
            {timeFormat(244887)}
          </Time>
          <RPM rpm={12443} />
          <Time isBest>
            <Label position="top-right">BEST LAP</Label>
            {timeFormat(94887)}
          </Time>
        </Row>
        <Row size={4}>
          <Col size={4} noBorder>
            <Speed>
              <Label position="top-left">SPEED</Label>334
            </Speed>
            <Lap>
              <Label position="top-left">LAP</Label>4/10
            </Lap>
          </Col>
          <Col size={3} noBorder>
            <Temp>24</Temp>
            <Temp>24</Temp>
          </Col>
          <Gear>
            <Label position="top-left">GEAR</Label>8
          </Gear>
          <Col size={3} noBorder>
            <Temp>204</Temp>
            <Temp>24</Temp>
          </Col>
          <Col size={4} noBorder>
            <Col></Col>
            <Col></Col>
          </Col>
        </Row>
        <Row size={2}>
          <Col size={4}></Col>
          <Col size={2.5}></Col>
          <Col size={6}>flag?</Col>
          <Col size={2.5}></Col>
          <Col size={4}></Col>
        </Row>
        <Row size={1}>
          {range(20).map((v) => (
            <Col
              key={`fuel_col_${v}`}
              style={{
                fontSize: "1rem",
                backgroundColor: v >= 4 ? "#284" : "#b22",
                mixBlendMode: "lighten",
              }}
            ></Col>
          ))}
        </Row>
      </Container>
    </>
  );
};
