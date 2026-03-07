import dynamic from 'next/dynamic';
import Head from 'next/head';

const PageShell = dynamic(() => import('../src/next/PageShell'), {
  ssr: false,
});

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About | Riordan Calculator</title>
      </Head>
      <PageShell page="about" />
    </>
  );
}
