import dynamic from 'next/dynamic';
import Head from 'next/head';

const PageShell = dynamic(() => import('../src/next/PageShell'), {
  ssr: false,
});

export default function SequencesPage() {
  return (
    <>
      <Head>
        <title>Sequences | Riordan Calculator</title>
      </Head>
      <PageShell page="sequences" />
    </>
  );
}
