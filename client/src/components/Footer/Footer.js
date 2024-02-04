import IconButton from "../IconButtons/IconButtons.js";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.left}>
            <h1 className={styles.title}>IYKYK</h1>
            <p className={styles.description}>Lexical and Syntax Analyzer</p>
            <p className={styles.description}>
              Final Project of Group 2 | 3-1N
            </p>
          </div>
          <div className={styles.right}>
            <IconButton icon="fab fa-github" />
          </div>
        </div>
      </div>
    </div>
  );
}
