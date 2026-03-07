import dynamic from 'next/dynamic';

const HistoryRoute = dynamic(() => import('../src/next/HistoryRoute'), {
  ssr: false,
});

export default HistoryRoute;
