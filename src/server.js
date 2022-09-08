/** @format */

import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import mongoose from "mongoose"

import {
  badRequestHandler,
  genericErrorHandler,
  notFoundHandler,
  unauthorizedErrorHandler,
} from "./errorHandlers.js"

import usersRouter from "./api/users/index.js"
import blogPostsRouter from "./api/blogPosts/index.js"

const server = express()
const port = process.env.PORT || 3001

server.use(cors())
server.use(express.json())

server.use("/posts", blogPostsRouter)
server.use("/users", usersRouter)

server.use(unauthorizedErrorHandler)
server.use(badRequestHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

mongoose.connect(process.env.MONGO_CONNECTION_URL)

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to MongoDB!")
  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server is running on port ${port}`)
  })
})
