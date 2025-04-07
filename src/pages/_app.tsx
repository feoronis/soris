import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { wrapper } from "@/store";
import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";

import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";

export default function App({ Component, pageProps: {session, ...pageProps}, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);

  return (
    
    <SessionProvider session={session} refetchOnWindowFocus={false} refetchInterval={60 * 10}>

      <Provider store={store}>
        <div className="layout-container">
          <Header />
          <Component {...pageProps} />
          <Footer />
        </div>
      </Provider>

    </SessionProvider>
    
  );
}