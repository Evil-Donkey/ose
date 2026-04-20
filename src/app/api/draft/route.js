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

const POST_TYPE_TO_PATH = {
  post:      (slug) => `/news/${slug}`,
  story:     (slug) => `/stories/${slug}`,
  portfolio: (slug) => `/portfolio/${slug}`,
  team:      (slug) => `/who/${slug}`,
  founder:   (slug) => `/founders/${slug}`,
}

const PAGE_SLUG_TO_PATH = {
  home:                       '/',
  'front-page':               '/',
  what:                       '/what',
  why:                        '/why',
  how:                        '/how',
  who:                        '/who',
  'deep-tech':                '/deep-tech',
  'health-tech':              '/health-tech',
  'life-sciences':            '/life-sciences',
  sustainability:             '/sustainability',
  'sustainability-policy':    '/sustainability-policy',
  'sustainability-disclosure':'/sustainability-disclosure',
  uncover:                    '/uncover',
  news:                       '/news',
  portfolio:                  '/portfolio',
  stories:                    '/stories',
  contact:                    '/contact',
  'privacy-policy':           '/privacy-policy',
  'terms-conditions':         '/terms-conditions',
  'complaints-policy':        '/complaints-policy',
  'modern-slavery-statement': '/modern-slavery-statement',
  'coinvestors-contact-form': '/coinvestors-contact-form',
  'shareholder-contact-form': '/shareholder-contact-form',
  'shareholder-portal':       '/shareholder-portal',
  'shareholder-portal-signup':'/shareholder-portal-signup',
  form:                       '/form',
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

  const draft = await draftMode()
  draft.enable()

  let redirectPath = '/'

  if (postType === 'page') {
    redirectPath = PAGE_SLUG_TO_PATH[slug] ?? `/${slug}`
  } else if (POST_TYPE_TO_PATH[postType]) {
    redirectPath = POST_TYPE_TO_PATH[postType](slug)
  }

  redirect(redirectPath)
}
