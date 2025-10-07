import getMeganavLinksLite from '@/lib/getMeganavLinksLite';
import getMeganavDataLite from '@/lib/getMeganavDataLite';
import HeaderWithMeganavLinks from './HeaderWithMeganavLinks';

/**
 * Server Component that fetches meganav data on the server side
 * This avoids the 504 timeout issues that occur when fetching on the client
 */
export default async function HeaderServer(props) {
  // Fetch data on the server side using the lightweight queries
  const [meganavLinks, meganavData] = await Promise.all([
    getMeganavLinksLite(),
    getMeganavDataLite()
  ]);

  // Pass the data to the client component
  return <HeaderWithMeganavLinks {...props} meganavLinks={meganavLinks} meganavData={meganavData} />;
}

