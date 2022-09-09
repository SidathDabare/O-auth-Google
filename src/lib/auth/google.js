/** @format */

import GoogleStrategy from "passport-google-oauth20"
import UsersModel from "../../api/users/model.js"
import { createAccessToken } from "./tools.js"

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.BE_URL + "/users/googleRedirect",
  },
  async (_, __, profile, passportNext) => {
    console.log("PROFILE: ", profile)
    try {
      const user = await UsersModel.findOne({ email: profile._json.email })

      if (user) {
        const accessToken = await createAccessToken({
          _id: user._id,
          role: user.role,
        })
        console.log("ACCESS TOKEN: ", accessToken)

        passportNext(null, { accessToken })
      } else {
        const { given_name, family_name, email } = profile._json

        const newUser = new UsersModel({
          firstName: given_name,
          lastName: family_name,
          email,
          googleID: profile.id,
        })
        const createdUser = await newUser.save()

        const accessToken = await createAccessToken({
          _id: createdUser._id,
          role: createdUser.role,
        })

        passportNext(null, { accessToken })
      }
    } catch (error) {
      passportNext(error)
    }
  }
)

export default googleStrategy
