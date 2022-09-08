/** @format */

import express from "express"
import createError from "http-errors"
import UserModel from "./model.js"
import { basicAuthMiddleware } from "../../lib/auth/basic.js"
import { createAccessToken } from "../../lib/auth/tools.js"
import { JWTAuthMiddleware } from "../../lib/auth/token.js"

const usersRouter = express.Router()

usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body)
    const { _id } = await newUser.save()

    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const users = await UserModel.find()
    res.send(users)
  } catch (error) {
    next(error)
  }
})
usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    //const user = await UserModel.find()
    res.send(req.user)
  } catch (error) {
    next(error)
  }
})
usersRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true, runValidators: true }
    )
    if (updatedUser) {
      res.send(updatedUser)
    } else {
      next(createError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.delete("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    await UserModel.findByIdAndDelete(req.user._id)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/:userId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId)
    if (user) {
      res.send(user)
    } else {
      next(createError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.put("/:userId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true, runValidators: true }
    )

    if (updatedUser) {
      res.send(updatedUser)
    } else {
      next(createError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.delete("/:userId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.userId)
    if (deletedUser) {
      res.status(204).send()
    } else {
      next(createError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.post("/register", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = new UserModel(req.body)
    const { _id } = await user.save()
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})
usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await UserModel.checkCredentials(email, password)

    if (user) {
      const token = await createAccessToken({ _id: user._id, role: user.role })
      res.send({ accessToken: token })
    } else {
      next(createError(401, "Credentials are not ok!"))
    }
  } catch (error) {
    next(error)
  }
})

export default usersRouter
