import Link from "next/link";
import style from "./Header.module.scss";

export const Header = () => (
  <header className={style.header}>
    <div className={style.wrapper}>
      <h1 className={style.h1}>Custard Library</h1>
      <nav className={style.nav}>
        <Link className={style.link} href="/">
          홈으로
        </Link>
        <Link className={style.link} href="/sample">
          샘플 보기
        </Link>
      </nav>
    </div>
  </header>
);
