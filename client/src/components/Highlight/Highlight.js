import styles from "./Highlight.module.scss";

export default function Highlight({ type, message }) {
  return (
    <div className={`${styles.highlight} ${styles[type]}`}>
      <p>{message}</p>
    </div>
  );
}
