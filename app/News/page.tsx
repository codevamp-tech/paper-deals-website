// pages/news.js
"use client";

import React, { useEffect, useState } from "react";

const NewsPage = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news`); // backend URL
        if (!res.ok) throw new Error(`Failed to fetch news: ${res.status}`);
        const data = await res.json();
        setNewsData(data.news || []); // extract news array
      } catch (err) {
        console.error(err);
        setError("Unable to fetch news at the moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600 font-medium">
        Loading news...
      </p>
    );

  if (error)
    return (
      <p className="text-center mt-10 text-red-500 font-semibold">{error}</p>
    );

  if (!newsData.length)
    return (
      <p className="text-center mt-10 text-gray-600 font-medium">
        No news available at the moment.
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Paper Deal News</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsData.map((news) => (
          <div
            key={news.id}
            className="bg-white shadow-md rounded-lg p-5 hover:shadow-xl transition duration-300"
          >
            {news.image && (
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
            )}
            <h2 className="text-xl font-semibold mb-2">{news.title}</h2>
            <p className="text-gray-600 mb-4">
              {news.data?.length > 150
                ? news.data.substring(0, 150) + "..."
                : news.data}
            </p>
            <p className="text-sm text-gray-400 mb-2">
              Published on: {new Date(news.date).toLocaleDateString()}
            </p>
            <a
              href={`/News/${news.id}`} // id-based link
              className="text-blue-600 hover:underline font-medium"
            >
              Read more
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsPage;
