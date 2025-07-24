import styles from "./app-logo.module.scss";

interface AppLogoProps {
  size?: "small" | "medium" | "large";
}

export function AppLogo(props: AppLogoProps) {
  const { size = "medium" } = props;
  return <div className={`${styles.tnkAppLogo} ${styles[`tnkAppLogo--${size}`]}`}>T</div>;
}
