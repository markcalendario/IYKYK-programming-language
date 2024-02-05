import styles from "./Buttons.module.scss";

export default function Button({
  className,
  id,
  name,
  onClick,
  children,
  style
}) {
  return (
    <button
      style={style}
      className={className ? `${className} ${styles.button}` : styles.button}
      name={name}
      id={id}
      onClick={onClick}>
      {children}
    </button>
  );
}
