// ** React Imports
import { ReactNode } from 'react';

// ** NextAuth Imports
import { SessionProvider } from 'next-auth/react'; // Import SessionProvider

import connectToMongoDB from './../configs/mongodb';

// ** Next Imports
import Head from 'next/head';
import { Router } from 'next/router';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';

// ** Store Imports
import { store } from 'src/store';
import { Provider } from 'react-redux';

// ** Loader Import
import NProgress from 'nprogress';

// ** Emotion Imports
import { CacheProvider } from '@emotion/react';
import type { EmotionCache } from '@emotion/cache';

// ** Config Imports
import 'src/configs/i18n';
import themeConfig from 'src/configs/themeConfig';

// ** Fake-DB Import
import 'src/@fake-db';

// ** Third Party Import
import { Toaster } from 'react-hot-toast';

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout';
import ThemeComponent from 'src/@core/theme/ThemeComponent';

// ** Spinner Import
import Spinner from 'src/@core/components/spinner';

// ** Contexts
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext';

// ** Styled Components
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast';

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache';

// ** Prismjs Styles
import 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css';

import 'src/iconify-bundle/icons-bundle-react';

// ** Global css styles
import '../../styles/globals.css';

// Call the connectToMongoDB function to establish a connection to MongoDB
connectToMongoDB();

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage;
  emotionCache: EmotionCache;
  pageProps: any; // Include pageProps with any type for session
};

const clientSideEmotionCache = createEmotionCache();

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start();
  });
  Router.events.on('routeChangeError', () => {
    NProgress.done();
  });
  Router.events.on('routeChangeComplete', () => {
    NProgress.done();
  });
}

// ** Configure JSS & ClassName
const App = ({ Component, emotionCache = clientSideEmotionCache, pageProps }: ExtendedAppProps) => {
  const contentHeightFixed = Component.contentHeightFixed ?? false;
  const getLayout = Component.getLayout ?? (page => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>);

  const setConfig = Component.setConfig ?? undefined;

  return (
    <SessionProvider session={pageProps.session}> {/* Wrap content with SessionProvider */}

      <Provider store={store}>
        <CacheProvider value={emotionCache}>
          <Head>
            <title>{`${themeConfig.templateName} - Material Design React Admin Template`}</title>
            {/* Meta tags */}
          </Head>

          <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
            <SettingsConsumer>
              {({ settings }) => (
                <ThemeComponent settings={settings}>

                    {getLayout(<Component {...pageProps} />)}

                  <ReactHotToast>
                    <Toaster position={settings.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
                  </ReactHotToast>
                </ThemeComponent>
              )}
            </SettingsConsumer>
          </SettingsProvider>
        </CacheProvider>
      </Provider>
    </SessionProvider>

  );
};

export default App;
