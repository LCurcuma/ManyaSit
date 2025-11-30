import SitAnim from "@/components/SitAnim";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <SitAnim/>
      </main>
    </div>
  );
}
