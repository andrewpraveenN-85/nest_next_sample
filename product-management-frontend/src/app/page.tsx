import Image from "next/image";
import styles from "./page.module.css";
import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <h1 className={styles.title}>
          Welcome to Inventory Management!
        </h1>
        <div className={styles.ctas}>
          <p>Please click login to access the demo</p>
          <Link href="/login" className={styles.button}>
            Login
          </Link>
          <Link href="/register" className={styles.button}>
            Register
          </Link>
        </div>
      </main>
      <footer className={styles.footer}>
        <p>This is a demo system build using Next Js as frontend, and Nest Js as Backend.</p>
        <p>Builed by APN.</p>
      </footer>
    </div>
  );
}
