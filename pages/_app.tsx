import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "store";
import { Nunito } from "@next/font/google";
import Navbar from "@/components/Navbar";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <main className={nunito.className}>
        <Navbar />
        <Component {...pageProps} />
      </main>
    </Provider>
  );
}
