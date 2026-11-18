import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://mazologic.com";
  return [
    { url: base,             lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/ai-os`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/audit`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "yearly",  priority: 0.2 },
    ...(["pl", "en"] as const).map(lang => ({
      url: `${base}/nod/${lang}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: { languages: { pl: `${base}/nod/pl`, en: `${base}/nod/en`, "x-default": `${base}/nod` } },
    })),
  ];
}
