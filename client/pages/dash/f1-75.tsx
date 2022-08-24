import type { NextPage } from "next";
import styled from "styled-components";
import Head from "next/head";
import { Dash } from "../../components/F1-75/";
import { useFullScreen } from "../../hooks/useFullScreen";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const F175DashPage: NextPage = () => {
  const { toggleFullScreen } = useFullScreen();

  return (
    <>
      <Head>
        <title>GT7 - Dash - F1-75</title>
      </Head>

      <Container onDoubleClick={toggleFullScreen}>
        <Dash />
      </Container>
    </>
  );
};

export default F175DashPage;
