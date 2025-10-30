"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";



const NewsDetailSkeleton = () => {
  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
      <div className="w-full h-60 bg-gray-200 rounded-md mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-11/12"></div>
        <div className="h-4 bg-gray-200 rounded w-10/12"></div>
        <div className="h-4 bg-gray-200 rounded w-8/12"></div>
      </div>
    </div>
  );
};

const NewsDetailPage = () => {
  const params = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news/getbyid/${params.id}`);
        if (!res.ok) throw new Error(`Failed to fetch news: ${res.status}`);
        const data = await res.json();
        setNews(data);
      } catch (err) {
        setError("Unable to fetch news detail at the moment.");
      } finally {
        setLoading(false);
      }
    };
    fetchNewsDetail();
  }, [params.id]);

  if (loading) return <NewsDetailSkeleton />;
  if (error) return <p>{error}</p>;
  if (!news) return <p>News not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4">{news.title}</h1>
        <p className="text-sm text-gray-400 mb-4">
          Published on: {new Date(news.date).toLocaleDateString()}
        </p>
        {news.image && <img src={news.image} alt={news.title} className="w-full h-60 object-cover rounded-md mb-4" />}
        <p className="text-gray-700 whitespace-pre-line">{news.data}</p>
      </div>
    </div>
  );
};

export default NewsDetailPage;
