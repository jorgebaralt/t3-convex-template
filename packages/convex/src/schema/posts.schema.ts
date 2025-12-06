import { defineTable } from "convex/server";
import { v } from "convex/values";

export const post = defineTable({
  title: v.string(),
  content: v.string(),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_created_at", ["createdAt"])
  .index("by_updated_at", ["updatedAt"]);
