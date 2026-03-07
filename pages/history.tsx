import dynamic from 'next/dynamic';
import Head from 'next/head';

const PageShell = dynamic(() => import('../src/next/PageShell'), {
  ssr: false,
});

export default function HistoryPage() {
  return (
    <>
      <Head>
        <title>History | Riordan Calculator</title>
      </Head>
      <PageShell page="history" />
    </>
  );
}
