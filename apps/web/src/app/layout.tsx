import style from "./layout.module.scss";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={style.body}>
        <header className={style.header}>
          <h1>Custard Library</h1>
          <nav className={style.nav}>
            <a href="/">홈으로</a>
            <a href="/sample">샘플 보기</a>
          </nav>
        </header>
        <main>
          <section>
            <h2>설명</h2>
            <p>가장 최근 실험중인 라이브러리를 소개합니다.</p>
          </section>
          {children}
        </main>
      </body>
    </html>
  );
}
