/** @format */

import jwt from "jsonwebtoken"

const payload = { _id: "oijoi3jo21j3o21j3o" }
const secret = "mysup3rs3cr3t"
const options = { expiresIn: 1 }

// const token = jwt.sign(payload, secret, options)

// console.log("TOKEN: ", token)

// const originalPayload = jwt.verify(
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJvaWpvaTNqbzIxajNvMjFqM28iLCJpYXQiOjE2NjI1Mzg0NzksImV4cCI6MTY2MjUzODQ4MH0.mlGSWNDnx23__RzkndvD7cxarwAU015tFdk-L-RCpxw",
//   secret
// )
// console.log("PAYLOAD: ", originalPayload)

// HOW TO CONVERT A CALLBACK BASED FUNCTION INTO A PROMISE BASED FUNCTION

jwt.sign(payload, secret, options, (err, token) => {})
jwt.verify(token, secret, (err, payload) => {})

// INPUT payload --> OUTPUT promise returning either an error or a token
const createAccessToken = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) reject(err)
      else resolve(token)
    })
  )

// USAGE
// try {
//   const token = await createAccessToken(payload)
// } catch (error) {
//   console.log(error)
// }

// createAccessToken(payload)
//   .then(token => console.log(token))
//   .catch(err => console.log(err))

const verifyAccessToken = (token) =>
  new Promise((res, rej) =>
    jwt.verify(token, secret, (err, payload) => {
      if (err) rej(err)
      else res(payload)
    })
  )

// const payload = await verifyAccessToken(token)
