import { Router } from 'express';
import fetch from 'node-fetch';

const router = Router();

const MOCK_NEWS = [
  {
    title: 'Premier League-də həftənin ən yaxşı oyunu bəlli oldu',
    source: 'Futbol.az Mock',
    publishedAt: new Date().toISOString(),
    url: 'https://futbol.az/news.html',
    urlToImage: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=1200&q=60',
    description: 'Azarkeşlər Arsenal - Liverpool matçını həftənin oyunu seçdi.',
  },
  {
    title: 'La Liga: Barselona yeni transferini təqdim etdi',
    source: 'Futbol.az Mock',
    publishedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    url: 'https://futbol.az/news.html',
    urlToImage: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=60',
    description: 'İspaniya nəhəngi heyətini gücləndirməyə davam edir.',
  },
  {
    title: 'Azərbaycan Premyer Liqasında tur gərgin keçdi',
    source: 'Futbol.az Mock',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    url: 'https://futbol.az/news.html',
    urlToImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=60',
    description: 'Liderlik uğrunda mübarizə daha da qızışır.',
  },
  {
    title: 'Çempionlar Liqasında pley-off cütlükləri açıqlandı',
    source: 'Futbol.az Mock',
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    url: 'https://futbol.az/news.html',
    urlToImage: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&w=1200&q=60',
    description: 'Avropanın ən güclü klubları növbəti mərhələdə üz-üzə gələcək.',
  },
];

function normalizeArticles(articles = []) {
  return articles
    .map((item) => ({
      title: item.title || 'Başlıq yoxdur',
      source: item.source?.name || item.source || 'Naməlum mənbə',
      publishedAt: item.publishedAt || new Date().toISOString(),
      url: item.url || '#',
      urlToImage: item.urlToImage || '',
      description: item.description || '',
    }))
    .filter((item) => item.title && item.url);
}

router.get('/', async (req, res) => {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey || !apiKey.trim()) {
    return res.json({ source: 'mock', articles: MOCK_NEWS });
  }

  try {
    const url = `https://newsapi.org/v2/everything?q=football&language=az,en&sortBy=publishedAt&pageSize=20&apiKey=${encodeURIComponent(apiKey)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.message || 'News API xətası',
      });
    }

    const articles = normalizeArticles(data.articles || []);
    return res.json({ source: 'newsapi', articles });
  } catch (error) {
    console.error('News fetch error:', error?.message || error);
    return res.json({ source: 'mock', articles: MOCK_NEWS });
  }
});

export default router;
