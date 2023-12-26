import styles from "./Buttons.module.scss";

export default function Button({ className, id, name, onClick, children }) {
  return (
    <button
      className={className ? `${className} ${styles.button}` : styles.button}
      name={name}
      id={id}
      onClick={onClick}>
      {children}
    </button>
  );
}
