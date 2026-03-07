import dynamic from 'next/dynamic';
import Head from 'next/head';

const PageShell = dynamic(() => import('../src/next/PageShell'), {
  ssr: false,
});

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Riordan Calculator</title>
      </Head>
      <PageShell page="home" />
    </>
  );
}
