import Button from "@/components/Buttons/Buttons.js";
import Input from "@/components/Inputs/Inputs.js";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.home}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <h1 className={styles.title}>IYKYK</h1>
          <p className={styles.description}>
            Welcome to IYKYK Lexical Analyzer
          </p>
          <Input placeholder="Session ID" />
          <Button className={styles.join}>Join Session</Button>
          <hr />
          <Button className={styles.createNew}>Create Session</Button>
        </div>
      </div>
    </div>
  );
}
