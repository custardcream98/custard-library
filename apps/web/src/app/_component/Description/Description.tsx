import { PropsWithClassName } from "../../../type";
import style from "./Description.module.scss";

export const Description = ({ className }: PropsWithClassName) => (
  <article className={`${style.wrapper} ${className}`}>
    <p>가장 최근 실험중인 라이브러리를 소개합니다.</p>
  </article>
);
