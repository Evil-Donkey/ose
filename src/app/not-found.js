import Link from 'next/link'
import Container from '../components/Container'
import HeaderServer from '@/components/Header/HeaderServer'
 
export default function NotFound() {
  return (
    <div>
        <HeaderServer fixed={true} />
        <Container className="pt-50 pb-20">
            <div className="flex justify-between">
                <div className="w-full lg:w-1/2 mb-5">
                    <h1 className="text-4xl lg:text-6xl/18 text-blue-02 mb-10">Not Found</h1>
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