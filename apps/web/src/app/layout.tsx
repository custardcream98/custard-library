import style from "./layout.module.scss";

import "../style/global.scss";
import { Description, Header } from "./_component";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={style.body}>
        <Header />
        <main className={style.main}>
          <Description className={style.description} />
          <div className="mdx">{children}</div>
        </main>
      </body>
    </html>
  );
}
