import { AppDefinition } from "../desktop/DesktopLauncher";
import About from "./about/About";
import ChatInteraction from "./chat/Chat";
import Calculator from "./calculator/Calculator";
import Image from "next/image";
type MenuDefinition = {
    id: string;
    title: string;
    icon: string;
    href: string;
}

export const AppList: AppDefinition[] = [
    {
        id: "chat",
        title: "Chat",
        icon: "MessageCircle",
        width: 400,
        height: 600,
        component: (
            <div className="p-4 text-white h-full">
                <ChatInteraction />
            </div>
        )
    },
    {
        id: "about",
        title: "About",
        icon: "User",
        width: 400,
        height: 600,
        component: (
            <div className="p-4 text-white h-full">
                <About />
            </div>
        )
    },
    {
        id: "flag",
        title: "Flag",
        icon: "FlagIcon",
        width: 300,
        height: 200,
        component: (
            <div className="text-white h-[176px] w-full">
                <div className="w-full h-2/5 bg-[#D60270]"></div>
                <div className="w-full h-1/5 bg-[#9B4F96]"></div>
                <div className="w-full h-2/5 bg-[#0038A8]"></div>
            </div>
        )
    },
    {
        id: "kitten",
        title: "Kitten",
        icon: "Cat",
        width: 768/3,
        height: 1024/3+24,
        component: (
            <div className="text-white w-full h-[341.33px] mt-[6px]">
                <Image src="/kitten.jpeg" alt="kitten" height={1024/3} width={768/3} />
            </div>
        )
    },
    {
        id: "calculator",
        title: "Calculator",
        icon: "Calculator",
        width: 320,
        height: 480,
        component: (
            <div className="text-white h-full">
                <Calculator />
            </div>
        )
    }
];

export const MenuList: MenuDefinition[] = AppList.map(app => ({
    id: app.id,
    title: app.title,
    icon: app.icon,
    href: `/${app.id}`
}));
