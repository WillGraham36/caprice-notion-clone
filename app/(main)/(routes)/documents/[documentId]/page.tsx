"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/toolbar";
import dynamic from "next/dynamic";
import { useMemo } from "react";



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

	if(document === undefined) {
		return <div>Loading...</div>
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