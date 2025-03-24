import fetchAPI from '../lib/api'
import generateMetadata from '../lib/generateMetadata'
import SignupForm from '../components/SignupForm'
import Header from '../components/Header'

generateMetadata("9");

export default async function Page() {

  const data = await fetchAPI(`
    query getHomePage {
      page(id: "9", idType: DATABASE_ID) {
        content(format: RENDERED)
        title(format: RENDERED)
      }
    }
  `);

  const title = data?.page?.title;
  const content = data?.page?.content;

  return (
    <div className="container mx-auto p-4">
      <Header portal={true} />
      <SignupForm />
    </div>
  )
};