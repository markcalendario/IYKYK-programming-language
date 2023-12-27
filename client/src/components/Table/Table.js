import styles from "./Table.module.scss";

export default function Table({ children }) {
  return <table className={styles.table}>{children}</table>;
}
