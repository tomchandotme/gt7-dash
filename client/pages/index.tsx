import type { NextPage } from "next";
import styled from "styled-components";
import Head from "next/head";
import Link from "next/link";

type Item = { title: string; path: string };

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  gap: 2rem;
`;

const StyledLink = styled.a`
  color: unset;
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

      <Container>
        {links.map(({ title, path }) => (
          <ItemLink title={title} path={path} key={`${title}_to_${path}`} />
        ))}
      </Container>
    </>
  );
};

export default Home;
