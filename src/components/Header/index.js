import Link from "next/link";
import Logo from "../Icons/Logo";

const Header = ({ portal }) => {
    return (
        <div className="flex items-center justify-between mb-10">
            <Link href="/"><Logo /></Link>
            {portal && <Link href="/investor-portal" className="bg-blue-500 text-white rounded-md p-2">Investor Portal</Link>}
        </div>
    )
}

export default Header;