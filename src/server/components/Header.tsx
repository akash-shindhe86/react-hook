import aemService from "@/server/services/aem";

export default async function Header({ version }: { version: string }) :Promise<any> {
    const header = await aemService.getHeaderRender(version);

    return (
        <header>
            <div dangerouslySetInnerHTML={{ __html: header }}></div>
        </header>
    )
}
