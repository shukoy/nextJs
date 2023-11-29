import Head from "next/head";
import styles from "./layout.module.css";
import utilStyles from "../../styles/utils.module.css";
import Link from "next/link";

const title = "課題管理一覧"
export const siteTitle = "課題管理"

export const Layout = (children:any) => {
    return (
        <div className={styles.container}>
            <Head>
            <link rel="icon" href="/favicon.ico" />
            </Head>
            <header className={styles.header}>
                <img src="/images/task.png" className={utilStyles.borderCircle}/>
                <Link href="/List"><h1>{title}</h1></Link>
            </header>
        </div>
    )
}