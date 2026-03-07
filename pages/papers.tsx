import dynamic from 'next/dynamic';

const PapersPage = dynamic(() => import('../src/next/pages/PapersPage'), {
  ssr: false,
});

export default PapersPage;
