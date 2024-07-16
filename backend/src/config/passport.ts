import passport from 'passport'
import {
  Strategy as GoogleStrategy,
  Profile as GoogleProfile,
  VerifyCallback as GoogleVerifyCallback
} from 'passport-google-oauth20'
import {
  Strategy as FacebookStrategy,
  Profile as FacebookProfile
} from 'passport-facebook'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string
const GOOGLE_CLIENT_SECRET = process.env
  .GOOGLE_CLIENT_SECRET as string
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID as string
const FACEBOOK_APP_SECRET = process.env
  .FACEBOOK_APP_SECRET as string

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/v1/auths/google/callback'
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: GoogleProfile,
      done: GoogleVerifyCallback
    ) => {
      return done(null, profile)
    }
  )
)

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: '/api/v1/auths/facebook/callback'
    },
    (
      accessToken: string,
      refreshToken: string,
      profile: FacebookProfile,
      done: (error: any, user?: any, info?: any) => void
    ) => {
      return done(null, profile)
    }
  )
)

passport.serializeUser(
  (
    user: Express.User,
    done: (err: any, id?: unknown) => void
  ) => {
    done(null, user)
  }
)

passport.deserializeUser(
  (
    user: Express.User,
    done: (err: any, user?: Express.User | false | null) => void
  ) => {
    done(null, user)
  }
)
