import { css } from "@style/css";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const style = css({
  backgroundColor: "blue.200",
  minHeight: "100vh",
});

export default async function HomePage() {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.from("test").select();

  return <main className={style}>{JSON.stringify(data)}</main>;
}
