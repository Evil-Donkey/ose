import Link from 'next/link'
import Container from '../components/Container'
 
export default function NotFound() {
  return (
    <div>
        <Container>
            <div className="flex justify-between">
                <div className="w-full lg:w-1/2 mb-5">
                    <h1>Not Found</h1>
                </div>
                <div className="w-full lg:w-2/5">
                    <p>Could not find requested resource</p>
                    <Link href="/" className='underline'>Return Home</Link>
                </div>
            </div>
        </Container>
    </div>
  )
}