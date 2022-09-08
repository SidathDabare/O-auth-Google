/** @format */

import express from "express"
import createHttpError from "http-errors"
import { basicAuthMiddleware } from "../../lib/auth/basic.js"
import BlogPostsModel from "./model.js"

const blogPostsRouter = express.Router()

blogPostsRouter.post("/", basicAuthMiddleware, async (req, res, next) => {
  try {
    const newBlogPosts = new BlogPostsModel(req.body)
    const { _id } = await newBlogPosts.save()

    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const blogPosts = await BlogPostsModel.find()
    res.send(blogPosts)
  } catch (error) {
    next(error)
  }
})
// blogPostsRouter.get("/", async (req, res, next) => {
//   try {
//     const mongoQuery = q2m(req.query)
//     const totalBlogPosts = await BlogPostsModel.countDocuments(
//       mongoQuery.criteria
//     )
//     const blogPosts = await BlogPostsModel.find(
//       mongoQuery.criteria,
//       mongoQuery.options.fields
//     )
//       .limit(mongoQuery.options.limit)
//       .skip(mongoQuery.options.skip)
//       .sort(mongoQuery.options.sort)
//       .populate({ path: "authors" }) //http://localhost:3001/blogPosts?title=Windows Internals1
//     //.populate({ path: "authors", select: "firstName lastName" }) //http://localhost:3001/blogPosts?title=Windows Internals1
//     // return { totalBlogPosts, blogPosts }
//     res.send({
//       links: mongoQuery.links(
//         "http://localhost:3001/blogPosts",
//         totalBlogPosts
//       ),
//       totalBlogPosts,
//       totalPages: Math.ceil(totalBlogPosts / mongoQuery.options.limit),
//       blogPosts,
//     })
//   } catch (error) {
//     next(error)
//   }
// })

blogPostsRouter.get("/:postId", async (req, res, next) => {
  try {
    const blogPost = await BlogPostsModel.findById(req.params.postId)
    if (blogPost) {
      res.send(blogPost)
    } else {
      next(
        createHttpError(
          404,
          `Blog Post with id ${req.params.postId} not found!`
        )
      )
    }
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.put("/:postId", async (req, res, next) => {
  try {
    const blogPosts = await BlogPostsModel.findByIdAndUpdate(
      req.params.postId, // WHO you want to modify
      req.body, // HOW you want to modify
      { new: true, runValidators: true }
    )

    if (blogPosts) {
      res.send(blogPosts)
    } else {
      next(createHttpError(404, `User with id ${req.params.postId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.delete("/:postId", async (req, res, next) => {
  try {
    const deleteBlogPost = await BlogPostsModel.findByIdAndDelete(
      req.params.postId
    )
    if (deleteBlogPost) {
      res.status(204).send()
    } else {
      next(createHttpError(404, `User with id ${req.params.postId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

export default blogPostsRouter
