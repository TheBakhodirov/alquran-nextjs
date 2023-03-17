import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { Provider, useDispatch } from "react-redux";
import { store } from "store";
import { Nunito } from "@next/font/google";
import Navbar from "@/components/Navbar";
import Player from "@/components/Player";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { Analytics } from "@vercel/analytics/react";

NProgress.configure({ showSpinner: false, parent: "#loading-bar" });

// show loading bar on route change start
Router.events.on("routeChangeStart", () => {
  NProgress.start();
});

// hide loading bar on route change complete
Router.events.on("routeChangeComplete", () => {
  NProgress.done();
});

// hide loading bar on route change error
Router.events.on("routeChangeError", () => {
  NProgress.done();
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "700"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <main className={nunito.className}>
        <Navbar />
        <div id="loading-bar"></div>
        <Component {...pageProps} />
        <Player />
        <Analytics />
      </main>
    </Provider>
  );
}
