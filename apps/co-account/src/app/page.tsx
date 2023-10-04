import { css } from "@style/css";

const style = css({
  backgroundColor: "blue.200",
  minHeight: "100vh",
});

export default function Home() {
  return <main className={style}></main>;
}
