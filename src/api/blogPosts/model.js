/** @format */

import mongoose from "mongoose"

const { Schema, model } = mongoose

const blogPostsSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    professions: [String],
    readTime: {
      value: { type: Number },
      unit: { type: String },
    },
    authors: [{ type: Schema.Types.ObjectId, ref: "Author" }],
    content: { type: String, required: false },
    commentHistory: [{ comment: String, rate: Number, created_At: Date }],
  },
  {
    timestamps: true,
  }
)

export default model("blogPosts", blogPostsSchema)
