import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

// mazologic.com/nod → /nod/pl albo /nod/en.
// Kolejność: wybór z przełącznika (cookie mazo-lang) → Accept-Language przeglądarki → EN.
export default async function NodRedirect() {
  const saved = (await cookies()).get("mazo-lang")?.value;
  if (saved === "pl" || saved === "en") redirect(`/nod/${saved}`);

  const accept = (await headers()).get("accept-language") ?? "";
  const ranked = accept
    .split(",")
    .map(part => {
      const [tag, ...params] = part.trim().toLowerCase().split(";");
      const q = params.find(p => p.trim().startsWith("q="));
      return { tag, q: q ? Number(q.trim().slice(2)) || 0 : 1 };
    })
    .filter(x => x.tag)
    .sort((a, b) => b.q - a.q);

  const first = ranked.find(x => x.tag.startsWith("pl") || x.tag.startsWith("en"));
  redirect(first?.tag.startsWith("pl") ? "/nod/pl" : "/nod/en");
}
