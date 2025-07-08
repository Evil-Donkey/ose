"use client";
import dynamic from "next/dynamic";

const FlexiblePage = dynamic(() => import("./FlexiblePage"), { ssr: false });

export default function FlexiblePageClient(props) {
  return <FlexiblePage {...props} />;
} 