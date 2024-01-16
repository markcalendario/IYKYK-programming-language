import styles from "./Table.module.scss";

export default function Table({ children, className }) {
  return (
    <table
      className={className ? styles.table + " " + className : styles.table}>
      {children}
    </table>
  );
}
