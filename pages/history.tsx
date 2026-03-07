import dynamic from 'next/dynamic';

const HistoryPage = dynamic(() => import('../src/next/pages/HistoryPage'), {
  ssr: false,
});

export default HistoryPage;
