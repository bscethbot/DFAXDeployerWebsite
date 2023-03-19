import styles from "../styles/Home.module.css";
import DFAXDeployer from "../components/DFAXDeployer";

export default function Home() {
  return (
    <div>
      <main className={styles.main}>
        <DFAXDeployer />
      </main>
    </div>
  );
}
