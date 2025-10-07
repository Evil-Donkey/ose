import getMeganavLinksLite from "@/lib/getMeganavLinksLite";
import getMeganavDataLite from "@/lib/getMeganavDataLite";
import CreatePasswordClient from "./CreatePasswordClient";

export default async function CreatePasswordPage() {
    const [meganavLinks, meganavData] = await Promise.all([
        getMeganavLinksLite(),
        getMeganavDataLite()
    ]);

    return <CreatePasswordClient meganavLinks={meganavLinks} meganavData={meganavData} />;
}
