// pages/news.js
"use client";

import { useTheme } from "@/hooks/use-theme";
import React, { useEffect, useState } from "react";
import PageAdvertising from "@/components/advertising/pageAdvetise";


const NewsSkeleton = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white shadow-md rounded-lg p-5 border border-gray-100"
        >
          <div className="w-full h-40 bg-gray-200 rounded-md mb-4"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      ))}
    </div>
  );
};

const NewsPage = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { theme } = useTheme();
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
      <div className="min-h-screen bg-gray-50 pb-12">
        <PageAdvertising />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <NewsSkeleton />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 pb-12">
        <PageAdvertising />
        <p className="text-center mt-10 text-red-500 font-semibold">{error}</p>
      </div>
    );

  if (!newsData.length)
    return (
      <div className="min-h-screen bg-gray-50 pb-12">
        <PageAdvertising />
        <p className="text-center mt-10 text-gray-600 font-medium">
          No news available at the moment.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Ads Banner */}
      <PageAdvertising />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-8 text-left">
          Paper Deal <span className="text-primary">News</span>
        </h1>

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
              className={`${theme.Text} hover:underline font-medium`}
            >
              Read more
            </a>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
