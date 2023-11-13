export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <header>
          <h1>Custard Library</h1>
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
