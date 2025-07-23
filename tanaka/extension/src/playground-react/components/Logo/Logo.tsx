import styles from "./logo.module.scss";

interface LogoProps {
  size?: "small" | "medium" | "large";
}

export function Logo({ size = "medium" }: LogoProps) {
  return <div className={`${styles.tnkLogo} ${styles[`tnkLogo--${size}`]}`}>T</div>;
}
