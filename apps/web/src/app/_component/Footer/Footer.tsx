"use client"; // 클라이언트측 올 해 연도 표기를 위해

import style from "./Footer.module.scss";

export const Footer = () => (
  <footer className={style.footer}>
    <p>© {new Date().getFullYear()} Shi Woo, Park (custardcream98). All rights reserved.</p>
    <ul className={style.linkList}>
      <li>
        <a className={style.link} href="https://github.com/custardcream98" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </li>
      <li>
        <a className={style.link} href="https://shiwoo.dev/" target="_blank" rel="noopener noreferrer">
          Blog
        </a>
      </li>
    </ul>
  </footer>
);
