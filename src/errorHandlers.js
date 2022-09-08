/** @format */

import mongoose from "mongoose"

export const unauthorizedErrorHandler = (err, req, res, next) => {
  if (err.status === 401) {
    res.status(401).send({ success: false, message: err.message })
  } else {
    next(err)
  }
}

export const badRequestHandler = (err, req, res, next) => {
  if (err.status === 400 || err instanceof mongoose.Error.ValidationError) {
    res.status(400).send({ message: err.message })
  } else if (err instanceof mongoose.Error.CastError) {
    res.status(400).send({ message: "You've sent a not valid _id!" })
  } else {
    next(err)
  }
}

export const notFoundHandler = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ message: err.message })
  } else {
    next(err)
  }
}

export const genericErrorHandler = (err, req, res, next) => {
  console.log(err)
  res.status(500).send({ message: "Generic Server Error" })
}
