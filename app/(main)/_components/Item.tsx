"use client";

import { Id } from "@/convex/_generated/dataModel";
import { ChevronDown, ChevronRight, LucideIcon, MoreHorizontal, PlusIcon, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@clerk/clerk-react";
import React from "react";

interface ItemProps {
    id?: Id<"documents">;
    documentIcon?: string;
    active?: boolean;
    isSearch?: boolean;
    level?: number;
    onExpand?: () => void;
    expanded?: boolean;
    label: string;
    onClick: () => void;
    icon: LucideIcon;
}

export const Item = ({
    id,
    label,
    onClick,
    icon: Icon,
    active,
    documentIcon,
    isSearch,
    level = 0,
    onExpand,
    expanded,
}: ItemProps) => {
    const ChevronIcon = expanded ? ChevronDown : ChevronRight;
    const create = useMutation(api.documents.create);
    const archive = useMutation(api.documents.archive);
    const deleteDocument = useMutation(api.documents.deleteDocument);
    const router = useRouter();
    const { user } = useUser();

    const onDeleteDocument = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        e.stopPropagation();
        if(!id) return;
        const promise = deleteDocument({ id });
        toast.promise(promise, {
            loading: "Deleting...",
            success: "Note deleted!",
            error: "Failed to delete note",
        });

        router.push("/documents");
    }

    const onArchive = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        e.stopPropagation();
        if(!id) return;
        const promise = archive({ id });

        toast.promise(promise, {
            loading: "Moving to trash...",
            success: "Note moved to trash!",
            error: "Failed to archive note",
        });
    };

    const handleExpand = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        e.stopPropagation();
        onExpand?.();
    }

    const onCreate = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        e.stopPropagation();
        if(!id) return;
        const promise = create({ title: "Untitled", parentDocument: id })
            .then((documentId) => {
                if(!expanded) {
                    onExpand?.();
                }
                router.push(`/documents/${documentId}`);
            });

        toast.promise(promise, {
            loading: "Creating note...",
            success: "Note created!",
            error: "Failed to create note",
        });
    }

    return (
        <div
            onClick={onClick}
            role="button"
            style={{paddingLeft: level ? `${(level * 12) + 12}px` : "12px"}} //using style since className will get overwritten
            //this is used for the indentation of the item
            className={cn(
                "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
                active && "bg-primary/5 text-primary",
            )}
        >
            {!!id && (
                <div 
                    role="button"
                    className="h-full rounded-sm hover:bg-neutral-300 hover:dark:bg-neutral-600 mr-1"
                    onClick={handleExpand}
                >
                    <ChevronIcon 
                        className="h-4 w-4 shrink-0 text-muted-foreground/50"
                    />
                </div>
            )}
            {documentIcon ? (
                <div className="shrink-0 mr-2 text-[18px]">
                    {documentIcon}
                </div>
            ): (
                <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground"/>
            )}
            <span className="truncate">
                {label}
            </span>
            {isSearch && (
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">ctl k</span>
                </kbd>
            )}
            {!!id && (
                <div className="ml-auto flex items-center gap-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            onClick={(e) => e.stopPropagation()}
                            asChild
                        >
                            <div
                                role="button"
                                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 hover:dark:bg-neutral-600"
                            >
                                <MoreHorizontal className="h-5 w-5 text-muted-foreground"/>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-60"
                            align="start"
                            side="right"
                            forceMount
                        >
                            <DropdownMenuItem onClick={onDeleteDocument} className="cursor-pointer">
                                <Trash  className="h-5 w-5 mr-2"/>
                                Delete
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <div className="text-xs text-muted-foreground p-2">
                                Last Edited by: {user?.fullName}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div
                        role="button"
                        onClick={onCreate}
                        className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:gb-neutral-300 hover:dark:bg-neutral-600"
                    >
                        <PlusIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                </div>
            )}
        </div>
    );
}


Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
    return (
        <div
            style={{paddingLeft: level ? `${(level * 12) + 25}px` : "12px"}}
            className="flex gap-x-2 py-[3px]"
        >
            <Skeleton className="h-4 w-4"/>
            <Skeleton className="h-4 w-[30%]"/>
        </div>
    )
}