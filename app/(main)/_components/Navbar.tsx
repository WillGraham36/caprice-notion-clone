"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Ellipsis, MenuIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { Title } from "./Title";
import { Publish } from "./Publish";
import { NoteOptions } from "./NoteOptions";

interface NavbarProps {
    isCollapsed: boolean;
    onResetWidth: () => void;
};

export const Navbar = ({
    isCollapsed,
    onResetWidth,
}: NavbarProps) => {
    const params = useParams();
    const document = useQuery(api.documents.getById, {documentId: params.documentId as Id<"documents">});

    if(document === undefined) {
        return (
            <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center">
                <Title.Skeleton />
            </nav>
        )
    }

    if(document === null) {
        return null;
    }

    return (
        <>
            <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4">
                {isCollapsed && (
                    <MenuIcon 
                        role="button"
                        onClick={onResetWidth}
                        className="h-6 w-6 text-muted-foreground"
                    />
                )}
                <div className="flex items-center justify-between w-full mx-2">
                    <Title initialData={document}/>
                    <div className="flex items-center gap-x-2">
                        <Publish initialData={document}/>
                        <NoteOptions id={document._id} />
                    </div>
                </div>
            </nav>
        </>
    )
}