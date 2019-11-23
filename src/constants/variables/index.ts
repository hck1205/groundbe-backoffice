type ServerUrl = {
  production: string
  beta: string
  development: string
}

const API_INFO_URL: ServerUrl = {
  production: "https://backoffice.groundbe.com/api",
  beta: "http://beta.backoffice.5boon.net/api",
  development: "http://localhost:3450/api"
}

const THUMBNAIL_INFO_URL: ServerUrl = {
  production: "https://gbimages.besports.live/resize-0x200/public/",
  beta: "https://beta-images.5boon.net/resize-0x200/public/",
  development: "https://beta-images.5boon.net/resize-0x200/public/"
}

// Stage
type Stage = "production" | "beta" | "development"
export const stage = process.env.NODE_ENV as Stage

// Local Storage
export const GROUNDBE_AUTH_TOKEN: string = "GROUNDBE_AUTH_TOKEN"
export const GROUNDBE_USER_INFO: string = "GROUNDBE_USER_INFO"

// Server Url Info
export const API_BASE_URL: string = API_INFO_URL[stage]
export const THUMBNAIL_BASE_URL: string = THUMBNAIL_INFO_URL[stage]
export const API_REQUEST_TIMEOUT: number = 10000

// Google OAuth
export const GOOGLE_AUTH_CLIENT_ID: string =
  "900433605089-n42fl67js36fukbpi75rdlrn2mvtkucr.apps.googleusercontent.com"
export const GOOGLE_TOKEN_VERIFY_URL: string =
  "https://oauth2.googleapis.com/tokeninfo?id_token="
export const GOOGLE_TOKEN_KEY: string = "googletoken"
