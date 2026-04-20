// WordPress must redirect its "Preview" button to:
// https://your-site.com/api/draft?secret=SECRET&postType=page&id=123
//
// ID-based preview is strongly preferred over slug-based because:
//   - Auto-drafts don't have a slug yet (post_name is empty)
//   - Slugs can change; IDs are stable
//   - WPGraphQL's asPreview arg only works with DATABASE_ID
//
// In functions.php:
//
// add_filter('preview_post_link', function ($link, $post) {
//   $secret = 'YOUR_PREVIEW_SECRET';
//   return add_query_arg([
//     'secret'   => $secret,
//     'postType' => get_post_type($post),
//     'id'       => $post->ID,
//   ], 'https://your-next-site.com/api/draft');
// }, 10, 2);

import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

const PREVIEW_PATH_BY_POST_TYPE = {
  post:      (token) => `/preview/post/${token}`,
  story:     (token) => `/preview/story/${token}`,
  portfolio: (token) => `/preview/portfolio/${token}`,
  team:      (token) => `/preview/team/${token}`,
  founder:   (token) => `/preview/founder/${token}`,
  page:      (token) => `/preview/page/${token}`,
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const secret   = searchParams.get('secret')
  const postType = searchParams.get('postType')
  const id       = searchParams.get('id')
  const slug     = searchParams.get('slug')

  if (secret !== process.env.WORDPRESS_PREVIEW_SECRET) {
    return new Response('Invalid preview token', { status: 401 })
  }

  if (!postType || (!id && !slug)) {
    return new Response('Missing postType and id/slug', { status: 400 })
  }

  const pathBuilder = PREVIEW_PATH_BY_POST_TYPE[postType]
  if (!pathBuilder) {
    return new Response(`Unsupported postType: ${postType}`, { status: 400 })
  }

  // Prefer ID — it's stable and works even for auto-drafts with no slug yet.
  // The loader functions recognise the "id-{n}" prefix and switch to a
  // DATABASE_ID lookup; a plain slug is left as-is (legacy fallback).
  const token = id ? `id-${id}` : slug

  const draft = await draftMode()
  draft.enable()

  redirect(pathBuilder(token))
}
