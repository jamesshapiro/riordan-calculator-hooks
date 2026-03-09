import type { AppProps } from 'next/app';
import '@radix-ui/colors/black-alpha.css';
import '@radix-ui/colors/blue.css';
import '@radix-ui/colors/green.css';
import '@radix-ui/colors/mauve.css';
import '@radix-ui/colors/red.css';
import '@radix-ui/colors/violet.css';
import '../src/reset.css';
import '../src/styles.css';
import '../src/components/AuthDialog/styles.css';
import '../src/components/ConfirmDeleteQueryDialog/styles.css';
import '../src/components/ModeComboBox/style.css';
import '../src/components/SequenceComboBox/style.css';
import '../src/components/SequenceEditorConfirmDeleteSequenceDialog/styles.css';
import '../src/components/ShareDialog/styles.css';
import '../src/components/TooltipWrapper/styles.css';
import '../src/components/UserDropdown/styles.css';

const BUILD_VERSION = '1.0.3';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <div
        style={{
          position: 'fixed',
          bottom: 4,
          right: 8,
          fontSize: 11,
          opacity: 0.4,
          color: 'gray',
          pointerEvents: 'none',
        }}
      >
        v{BUILD_VERSION}
      </div>
    </>
  );
}
