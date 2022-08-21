import type { NextPage } from "next";
import styled from "styled-components";
import Head from "next/head";
import Dashboard from "../components/Dashboard";
import { MouseEventHandler } from "react";
import { useFullScreen } from "../hooks/useFullScreen";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Home: NextPage = () => {
  const { toggleFullScreen } = useFullScreen();

  return (
    <>
      <Head>
        <title>GT7 - Dash</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container onDoubleClick={toggleFullScreen}>
        <Dashboard />
      </Container>
    </>
  );
};

export default Home;
