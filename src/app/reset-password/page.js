import getMeganavLinksLite from "@/lib/getMeganavLinksLite";
import getMeganavDataLite from "@/lib/getMeganavDataLite";
import ResetPasswordClient from "./ResetPasswordClient";

export default async function ResetPasswordPage() {
    const [meganavLinks, meganavData] = await Promise.all([
        getMeganavLinksLite(),
        getMeganavDataLite()
    ]);

    return <ResetPasswordClient meganavLinks={meganavLinks} meganavData={meganavData} />;
}
