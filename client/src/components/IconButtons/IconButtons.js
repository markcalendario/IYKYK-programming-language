import styles from "./IconButtons.module.scss";

export default function IconButton({ title, onClick, icon }) {
  return (
    <i
      onClick={onClick}
      title={title}
      className={`fas ${icon} fa-fw ${styles.iconButton}`}
    />
  );
}
