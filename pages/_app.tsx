import type { AppProps } from 'next/app';

import '../src/reset.css';
import '../src/styles.css';
import '../src/components/AuthDialog/styles.css';
import '../src/components/ConfirmDeleteQueryDialog/styles.css';
import '../src/components/SequenceEditorConfirmDeleteSequenceDialog/styles.css';
import '../src/components/TooltipWrapper/styles.css';
import '../src/components/UserDropdown/styles.css';
import '../src/components/ShareDialog/styles.css';
import '../src/components/SequenceComboBox/style.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
