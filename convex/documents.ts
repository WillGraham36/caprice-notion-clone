import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Doc, Id } from './_generated/dataModel';

/*
    * This is the Convex backend for the Notion clone. It contains the Convex
    * queries and mutations that are used in the frontend.
    * 
    * This REST API is used to create and read documents from the database.
    */


export const get = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) { //un-registered user is trying to create a document
            throw new Error("Not authorized");
        }

        const documents = await ctx.db.query("documents").collect();

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