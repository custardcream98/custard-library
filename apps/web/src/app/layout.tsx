import style from "./layout.module.scss";

import "../style/global.scss";
import { Description, Footer, Header } from "./_component";

export { metadata } from "./metadata";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={style.body}>
        <Header />
        <main className={style.main}>
          <Description className={style.description} />
          <div className="mdx">{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
