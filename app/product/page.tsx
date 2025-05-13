"use client";
import React, { useState } from "react";
import ProductList from "./AllProduct";
import Advertisement from "./Advertisement";
import PriceList from "./ProductListing";
import Detail from "./detail/page";

export default function Product() {
  return (
    <div>
      <Advertisement />
      <ProductList />
      <PriceList />
      <Detail />
    </div>
  );
}
