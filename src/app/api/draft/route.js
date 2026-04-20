// WordPress must redirect its "Preview" button to:
// https://your-site.com/api/draft?secret=SECRET&postType=post&slug=my-slug
//
// Add this filter to your WordPress theme's functions.php or a custom plugin:
//
// add_filter('preview_post_link', function($link, $post) {
//   $secret = 'YOUR_PREVIEW_SECRET'; // must match WORDPRESS_PREVIEW_SECRET env var
//   $type   = get_post_type($post);
//   $slug   = $post->post_name ?: 'draft-' . $post->ID;
//   return 'https://your-next-site.com/api/draft?secret=' . $secret
//        . '&postType=' . $type . '&slug=' . $slug;
// }, 10, 2);

import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

const PREVIEW_PATH_BY_POST_TYPE = {
  post:      (slug) => `/preview/post/${slug}`,
  story:     (slug) => `/preview/story/${slug}`,
  portfolio: (slug) => `/preview/portfolio/${slug}`,
  team:      (slug) => `/preview/team/${slug}`,
  founder:   (slug) => `/preview/founder/${slug}`,
  page:      (slug) => `/preview/page/${slug}`,
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const secret   = searchParams.get('secret')
  const postType = searchParams.get('postType')
  const slug     = searchParams.get('slug')

  if (secret !== process.env.WORDPRESS_PREVIEW_SECRET) {
    return new Response('Invalid preview token', { status: 401 })
  }

  if (!postType || !slug) {
    return new Response('Missing postType or slug', { status: 400 })
  }

  const pathBuilder = PREVIEW_PATH_BY_POST_TYPE[postType]
  if (!pathBuilder) {
    return new Response(`Unsupported postType: ${postType}`, { status: 400 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(pathBuilder(slug))
}
