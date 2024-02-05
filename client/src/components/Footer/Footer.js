import styles from "./Footer.module.scss";

export default function Footer() {
  const onGithubClick = () => {
    window.open(process.env.NEXT_PUBLIC_GITHUB, "_blank");
  };

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
            <a
              href={process.env.NEXT_PUBLIC_GITHUB}
              target="_blank"
              rel="noopener noreferrer">
              github.com/markcalendario/IYKYK-programming-language
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
