import dynamic from 'next/dynamic';
import Head from 'next/head';

const PageShell = dynamic(() => import('../src/next/PageShell'), {
  ssr: false,
});

export default function PapersPage() {
  return (
    <>
      <Head>
        <title>Papers | Riordan Calculator</title>
      </Head>
      <PageShell page="papers" />
    </>
  );
}
