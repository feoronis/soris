import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { wrapper } from "@/store";
import { Provider } from "react-redux";

import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";

export default function App({ Component, pageProps, ...rest }: AppProps) {
  const {store, props} = wrapper.useWrappedStore(rest);

  return (
    <Provider store={store}>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </Provider>
  );
}