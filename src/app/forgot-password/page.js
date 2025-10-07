import getMeganavLinksLite from "@/lib/getMeganavLinksLite";
import getMeganavDataLite from "@/lib/getMeganavDataLite";
import ForgotPasswordClient from "./ForgotPasswordClient";

export default async function ForgotPasswordPage() {
    const [meganavLinks, meganavData] = await Promise.all([
        getMeganavLinksLite(),
        getMeganavDataLite()
    ]);

    return <ForgotPasswordClient meganavLinks={meganavLinks} meganavData={meganavData} />;
}
