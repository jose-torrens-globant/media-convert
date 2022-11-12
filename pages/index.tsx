import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import React from "react";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Media Convert Test</title>
        <meta
          name="description"
          content="Test app to play using AWS' S3 and MediaConvert"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>List</h1>

        <ul>
          <li>Video name</li>
          <li>Video name</li>
          <li>Video name</li>
          <li>Video name</li>
        </ul>
      </main>
    </div>
  );
}
