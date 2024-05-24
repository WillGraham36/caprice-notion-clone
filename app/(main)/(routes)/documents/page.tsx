"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react"; 
import { PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";


const DocumentsPage = () => {
    const { user } = useUser();
    const create = useMutation(api.documents.create);

    const onCreate = () => {
        const promise = create({ title: "Untitled" });

        // Show toast notification (little pop-up message at the bottom of the screen)
        toast.promise(promise, {
            loading: "Creating note...",
            success: "New note created!",
            error: "Failed to create note"
        })
    }

    return (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <h1 className="text-lg font-medium">
                Welcome to {user?.firstName == null ? "your" : `${user?.firstName}'s`} Caprice
            </h1>
            <Button onClick={onCreate}>
                <PlusCircle className="h-4 w-4 mr-2"/>
                Create Note
            </Button>
        </div>
    )
}

export default DocumentsPage