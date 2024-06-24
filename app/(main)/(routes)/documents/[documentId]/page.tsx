"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/toolbar";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";



interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
}

const DocumentIdPage = ({
  params 
}: DocumentIdPageProps) => {
	const document = useQuery(api.documents.getById, {
		documentId: params.documentId
	});
	const Editor = useMemo(() => dynamic(() => import("@/components/editor"), { ssr: false}), []);
	
	const update = useMutation(api.documents.update);
	const onChange = (content: string) => {
		update({
			id: params.documentId,
			content
		})
	}

	//documents are loading
	if(document === undefined) {
		return (
			<div className="pb-40 pt-28 pl-[19%]">
				<Skeleton className="w-20 h-20 rounded-full mb-3"/>
				<Skeleton className="max-w-[30%] h-16 mb-9"/>
				<Skeleton className="w-52 h-6 mb-3"/>
				<Skeleton className="w-80 h-6 mb-3"/>
				<Skeleton className="w-40 h-6 mb-3 ml-10"/>
				<Skeleton className="w-80 h-6 mb-3 ml-10"/>
				<Skeleton className="w-[60%] h-6 mb-3"/>
				<Skeleton className="w-52 h-6 mb-3"/>
				<Skeleton className="w-20 h-6 mb-3"/>
			</div>
		)
	}
	if(document == null) {
		return <div>Not found</div>
	}

	

	return (
	<div className="pb-40 pt-32">
		<div className="md:mad-w-4xl lg:max-w-5xl mx-auto">
			<Toolbar initialData={document}/>
			<Editor 
				onChange={onChange}
				initialContent={document.content}
			/>
		</div>
	</div>
	)
}

export default DocumentIdPage