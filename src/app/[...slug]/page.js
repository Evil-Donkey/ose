import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import getPageBySlug from '@/lib/getPageBySlug'
import getFlexiblePage from '@/lib/getFlexiblePage'
import getPopOutData from '@/lib/getPopOutData'
import getFooterData from '@/lib/getFooterData'
import getMeganavLinksLite from '@/lib/getMeganavLinksLite'
import getMeganavDataLite from '@/lib/getMeganavDataLite'
import getTeamMembers from '@/lib/getTeamMembers'
import getFounders from '@/lib/getFounders'
import { hasTeamComponent, hasFoundersComponent } from '@/lib/checkFlexibleComponents'
import FlexiblePageClient from '@/components/Templates/FlexiblePageClient'
import HeaderServer from '@/components/Header/HeaderServer'
import Container from '@/components/Container'
import CTA from '@/components/CTA'

// This route only serves draft/preview requests.
// In normal mode it returns 404, so it never interferes with production routing.
export default async function PreviewCatchAllPage({ params }) {
  const { isEnabled: preview } = await draftMode()

  if (!preview) notFound()

  const resolvedParams = await params
  const slugString = Array.isArray(resolvedParams.slug)
    ? resolvedParams.slug.join('/')
    : resolvedParams.slug

  const page = await getPageBySlug(slugString)

  if (!page) {
    return (
      <>
        <HeaderServer fixed={false} />
        <Container className="pt-40 pb-20">
          <h1 className="text-3xl mb-4">Page not found in WordPress</h1>
          <p className="text-gray-500">
            No draft or published page found for slug: <code>{slugString}</code>
          </p>
        </Container>
      </>
    )
  }

  const [flexibleContent, popOutData, footerData, meganavLinks, meganavData] = await Promise.all([
    getFlexiblePage(page.databaseId),
    getPopOutData(),
    getFooterData(),
    getMeganavLinksLite(),
    getMeganavDataLite(),
  ])

  const teamData = hasTeamComponent(flexibleContent) ? await getTeamMembers() : null
  const foundersData = hasFoundersComponent(flexibleContent) ? await getFounders() : null

  const ctaData = {
    copy: footerData?.ctaCopy,
    title: footerData?.ctaTitle,
    cta: footerData?.cta,
  }

  // Render ACF flexible content blocks if the page has them
  if (flexibleContent?.length) {
    return (
      <FlexiblePageClient
        flexibleContent={flexibleContent}
        popOutData={popOutData}
        meganavLinks={meganavLinks}
        meganavData={meganavData}
        teamData={teamData}
        foundersData={foundersData}
      >
        <CTA data={ctaData} />
      </FlexiblePageClient>
    )
  }

  // Fallback: plain title + WYSIWYG content (page has no flexible blocks yet)
  return (
    <>
      <HeaderServer fixed={false} />
      <Container className="pt-30 pb-20">
        {page.title && (
          <h1
            className="text-4xl lg:text-6xl mb-8"
            dangerouslySetInnerHTML={{ __html: page.title }}
          />
        )}
        {page.content && (
          <div
            className="prose max-w-none text-blue-02"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        )}
      </Container>
      <CTA data={ctaData} />
    </>
  )
}
