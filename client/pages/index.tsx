import type { NextPage } from "next";
import styled, { createGlobalStyle } from "styled-components";
import Head from "next/head";
import Link from "next/link";

type Item = { title: string; path: string };

const GlobalStyle = createGlobalStyle`
  @media (orientation: landscape) {
    :root {
      font-size: 1.5vmin;
    }
  }

  @media (orientation: portrait) {
    :root {
      font-size: 1.8vmin;
    }
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  height: 100%;

  gap: 4rem;
`;

const Row = styled.div<{ backgroundColor?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;

  flex-direction: row;

  gap: 4rem;
`;

const Title = styled(Row)`
  font-size: 8rem;
  font-weight: 100;
`;

const Text = styled(Title)`
  margin-top: 6rem;
  font-size: 4rem;
`;

const StyledLink = styled.a`
  font-size: 2rem;
  font-weight: 200;
  text-decoration: none;

  color: #fff;
  background-color: #333;

  padding: 1rem 4rem;
  border-radius: 2rem;

  &:hover,
  &:active,
  &:focus-visible {
    outline: 0.1rem solid #fff;
    outline-offset: 0.5rem;
  }
`;

const ItemLink = ({ title, path }: Item) => (
  <Link href={path} passHref>
    <StyledLink>{title}</StyledLink>
  </Link>
);

const links = [
  { title: "Beta", path: "/dash/beta" },
  { title: "F1-75", path: "/dash/f1-75" },
];

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>GT7 - Dash</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <GlobalStyle />

      <Container>
        <Title>GT7 - Dash</Title>

        <Text>Dash Theme:</Text>

        <Row>
          {links.map(({ title, path }) => (
            <ItemLink title={title} path={path} key={`${title}_to_${path}`} />
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Home;
