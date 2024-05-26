import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Doc, Id } from './_generated/dataModel';

/*
    * This is the Convex backend for the Notion clone. It contains the Convex
    * queries and mutations that are used in the frontend.
    * 
    * This REST API is used to create and read documents from the database.
    */


export const deleteDocument = mutation({
    args: {id: v.id("documents")},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if(!identity) { //un-registered user is trying to create a document
            throw new Error("Not authorized");
        }
        const userId = identity.subject;

        //Check the user is authorized to delete the document and it exists
        const existingDocument = await ctx.db.get(args.id);
        if(!existingDocument) {
            throw new Error("Document not found");
        }
        if(existingDocument.userId !== userId) {
            throw new Error("Not authorized to archive this document");
        }

        
        const recursivelyDelete = async(documentId: Id<"documents">) => {
            const children = await ctx.db
            .query("documents")
            .withIndex("by_user_parent", (q) =>(
                q
                .eq("userId", userId)
                .eq("parentDocument", documentId)
            ))
            .collect();
            
            for(const child of children) {
                await recursivelyDelete(child._id);
                await ctx.db.delete(child._id);
            }
        }
        
        recursivelyDelete(args.id);
        const document = await ctx.db.delete(args.id);

        return document;
    }
})



export const archive = mutation({
    args: {id: v.id("documents")},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) { //un-registered user is trying to create a document
            throw new Error("Not authorized");
        }
        const userId = identity.subject;

        const existingDocument = await ctx.db.get(args.id);
        if(!existingDocument) {
            throw new Error("Document not found");
        }

        if(existingDocument.userId !== userId) {
            throw new Error("Not authorized to archive this document");
        }

        const document = await ctx.db.patch(args.id, {
            isArchived: true,
        });

        const recursivelyArchive = async(documentId: Id<"documents">) => {
            const children = await ctx.db
                .query("documents")
                .withIndex("by_user_parent", (q) =>(
                    q
                        .eq("userId", userId)
                        .eq("parentDocument", documentId)
                ))
                .collect();

            for(const child of children) {
                await ctx.db.patch(child._id, {
                    isArchived: true,
                });

                await recursivelyArchive(child._id);
            }
        }

        recursivelyArchive(args.id);

        return document;

    }
});


export const getSidebar = query({
    args: {
        parentDocument: v.optional(v.id("documents")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) { //un-registered user is trying to create a document
            throw new Error("Not authorized");
        }

        const userId = identity.subject;

        const documents = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) => 
            q
                .eq("userId", userId)
                .eq("parentDocument", args.parentDocument)
        )
        .filter((q) =>
            q.eq(q.field("isArchived"), false)   
        )
        .order("desc")
        .collect();

        return documents;
    }
});


// Create new document in the database
export const create = mutation({
    args: {
        title: v.string(),
        parentDocument: v.optional(v.id("documents")), 
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) { //un-registered user is trying to create a document
            throw new Error("Not authorized");
        }

        const userId = identity.subject;

        const document = await ctx.db.insert("documents", {
            title: args.title,
            parentDocument: args.parentDocument,
            userId,
            isArchived: false,
            isPublished: false,
        })

        return document;
    }
});