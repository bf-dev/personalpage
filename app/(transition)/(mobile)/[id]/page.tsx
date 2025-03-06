import { AppList } from "@/components/apps/AppList";
import { notFound } from "next/navigation";
import MobileMenu from "../MobileMenu";

export default async function AppPage({ params }: { params: Promise<{ id: string }> }) {
    const appId = (await params).id;
    const selectedApp = AppList.find(app => app.id === appId);

    if (!selectedApp) {
        return notFound();
    }

    return (
        <>
            {selectedApp.component}
        </>
    );
}