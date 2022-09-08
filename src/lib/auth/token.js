/** @format */

import createHttpError from "http-errors"
import { verifyAccessToken } from "./tools.js"

export const JWTAuthMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(
      createHttpError(
        401,
        "Please provide Bearer token in the authorization header!"
      )
    )
  } else {
    try {
      const token = req.headers.authorization.replace("Bearer ", "")

      const payload = await verifyAccessToken(token)

      req.user = {
        _id: payload._id,
        role: payload.role,
      }

      next()
    } catch (error) {
      console.log(error)
      next(createHttpError(401, "Token not valid!"))
    }
  }
}
