export default function sitemap() {
  const baseUrl = "https://github-analyzer-omega.vercel.app";

  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/documentation`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/playground`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dashboards`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
  ];

  return routes;
}
