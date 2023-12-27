import styles from "./Inputs.module.scss";

export default function Input({
  id,
  className,
  name,
  type,
  value,
  placeholder,
  onChange
}) {
  return (
    <div className={styles.input}>
      {placeholder ? <p>{placeholder}</p> : null}
      <input
        id={id}
        className={className}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
