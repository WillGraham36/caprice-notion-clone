"use client";


import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useMutation } from "convex/react";
import { Ellipsis, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface NoteOptionProps {
    id: Id<"documents">;
};

export const NoteOptions = ({id}: NoteOptionProps) => {
    const deleteDocument = useMutation(api.documents.deleteDocument);
    const router = useRouter();

    const onDeleteDocument = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        e.stopPropagation();
        if(!id) return;
        const promise = deleteDocument({ id });
        toast.promise(promise, {
            loading: "Deleting...",
            success: "Deleted!",
            error: "Failed to delete",
        });
        router.push("/documents");
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Ellipsis className="h-6 w-6" />
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                <DropdownMenuItem onClick={onDeleteDocument} className="cursor-pointer">
                    <Trash className="h-5 w-5 mr-2" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}