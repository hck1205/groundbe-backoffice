declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined
    }
  }
}

interface Window {
  renderGoogleBtn: any
  gapi: any
}

declare module "*.bmp" {
  const src: string
  export default src
}

declare module "*.gif" {
  const src: string
  export default src
}

declare module "*.jpg" {
  const src: string
  export default src
}

declare module "*.jpeg" {
  const src: string
  export default src
}

declare module "*.png" {
  const src: string
  export default src
}
