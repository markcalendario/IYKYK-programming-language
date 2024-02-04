import styles from "./FullPageLoader.module.scss";

export default function FullPageLoader() {
  return (
    <div class={styles.wrapper}>
      <svg>
        <text x="50%" y="50%" dy=".35em" text-anchor="middle">
          IYKYK
        </text>
      </svg>
      <p>Loading Lexer and Parser</p>
    </div>
  );
}
