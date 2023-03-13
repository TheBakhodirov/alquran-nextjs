import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import Quran from "public/koran.png";
import QuranListening from "public/quran-listen.png";
import Praying from "public/prayer-time.png";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function Home() {
  const mode = useSelector((state: RootState) => state.theme.mode);

  return (
    <>
      <Head>
        <title>Al Quran</title>
        <meta
          name="description"
          content="Holy Quran website with prayer times"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={mode === "light" ? styles.light : styles.dark}>
        <div className={styles.pages}>
          <Link href="/surahs">
            <div className={styles.card}>
              <Image src={Quran} width={150} alt="Holy Quran" priority />
              <p>Qur'on suralari</p>
            </div>
          </Link>
          <Link href="/player">
            <div className={styles.card}>
              <Image src={QuranListening} width={150} alt="Holy Quran Book" priority />
              <p>Qur'on Tinglash</p>
            </div>
          </Link>
          <Link href="/prayers">
            <div className={styles.card}>
              <Image src={Praying} width={150} alt="Praying" priority />
              <p>Namoz vaqtlari</p>
            </div>
          </Link>
        </div>
        <a
          className={styles.credit_link}
          href="https://www.flaticon.com/free-icons/islam"
          target="_blank"
          title="Islamic icons"
        >
          Icons by Flaticon
        </a>
      </main>
    </>
  );
}
