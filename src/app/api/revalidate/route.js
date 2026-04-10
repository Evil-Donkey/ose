import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

const POST_TYPE_TO_PATHS = {
  post: (slug) => ["/news", slug && `/news/${slug}`],
  portfolio: (slug) => ["/portfolio", slug && `/portfolio/${slug}`],
  story: (slug) => ["/stories", slug && `/stories/${slug}`],
  team: (slug) => ["/who", slug && `/who/${slug}`],
  founder: (slug) => ["/founders", slug && `/founders/${slug}`],
  portfolio_news: () => ["/portfolio-news"],
};

const PAGE_SLUG_TO_PATH = {
  home: "/",
  "front-page": "/",
  what: "/what",
  why: "/why",
  how: "/how",
  who: "/who",
  "deep-tech": "/deep-tech",
  "health-tech": "/health-tech",
  "life-sciences": "/life-sciences",
  sustainability: "/sustainability",
  "sustainability-policy": "/sustainability-policy",
  "sustainability-disclosure": "/sustainability-disclosure",
  uncover: "/uncover",
  news: "/news",
  portfolio: "/portfolio",
  stories: "/stories",
  contact: "/contact",
  "privacy-policy": "/privacy-policy",
  "terms-conditions": "/terms-conditions",
  "complaints-policy": "/complaints-policy",
  "modern-slavery-statement": "/modern-slavery-statement",
  "coinvestors-contact-form": "/coinvestors-contact-form",
  "shareholder-contact-form": "/shareholder-contact-form",
  "shareholder-portal": "/shareholder-portal",
  "shareholder-portal-signup": "/shareholder-portal-signup",
  form: "/form",
};

function getPathsToRevalidate(postType, slug) {
  if (postType === "page") {
    const pagePath = PAGE_SLUG_TO_PATH[slug];
    return pagePath ? [pagePath] : [];
  }

  const resolver = POST_TYPE_TO_PATHS[postType];
  if (!resolver) return [];

  return resolver(slug).filter(Boolean);
}

export async function POST(request) {
  console.log("[revalidate] Received request");

  const secret = request.headers.get("x-revalidate-secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    console.log("[revalidate] Invalid secret");
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { post_type, slug, revalidate_all } = body;

    console.log("[revalidate] Payload:", JSON.stringify({ post_type, slug, revalidate_all }));

    if (revalidate_all) {
      revalidatePath("/", "layout");
      console.log("[revalidate] Full site revalidation triggered");
      return NextResponse.json({
        revalidated: true,
        paths: ["/ (full site)"],
      });
    }

    if (!post_type) {
      return NextResponse.json(
        { message: "Missing post_type in payload" },
        { status: 400 }
      );
    }

    const paths = getPathsToRevalidate(post_type, slug);

    if (paths.length === 0) {
      console.log(`[revalidate] No paths mapped for post_type "${post_type}", slug "${slug}"`);
      return NextResponse.json(
        { message: `No paths mapped for post_type "${post_type}"` },
        { status: 200 }
      );
    }

    const typesOnHomepage = ["post", "portfolio", "story", "team", "founder"];
    if (typesOnHomepage.includes(post_type) && !paths.includes("/")) {
      paths.push("/");
    }

    for (const path of paths) {
      revalidatePath(path);
    }

    console.log("[revalidate] Revalidated paths:", paths);
    return NextResponse.json({ revalidated: true, paths });
  } catch (error) {
    console.error("[revalidate] Error:", error);
    return NextResponse.json(
      { message: "Revalidation failed", error: error.message },
      { status: 500 }
    );
  }
}
