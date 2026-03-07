import dynamic from 'next/dynamic';

const SequencesPage = dynamic(() => import('../src/next/pages/SequencesPage'), {
  ssr: false,
});

export default SequencesPage;
