import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { authComponent } from "../auth";

// List all posts (public query)
export const list = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("post")
      .withIndex("by_created_at")
      .order("desc")
      .take(10);
    return posts;
  },
});

// Get a post by ID (public query)
export const get = query({
  args: { id: v.id("post") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a post (protected mutation)
export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // Check authentication
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    const now = Date.now();
    return await ctx.db.insert("post", {
      title: args.title,
      content: args.content,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Delete a post (protected mutation)
export const remove = mutation({
  args: { id: v.id("post") },
  handler: async (ctx, args) => {
    // Check authentication
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
  },
});


