import Axios, { AxiosInstance, AxiosResponse } from "axios"

import { Alert } from "components/common"
import storage from "lib/storage"
import {
  GROUNDBE_AUTH_TOKEN,
  GROUNDBE_USER_INFO,
  GOOGLE_TOKEN_VERIFY_URL,
  GOOGLE_AUTH_CLIENT_ID
} from "constants/variables"

import { LOGIN_MSG } from "constants/messages"
import { LooseObject } from "lib/help"

class OAuth {
  private onSuccess = (googleUser: any) => {
    storage.set(GROUNDBE_AUTH_TOKEN, googleUser.getAuthResponse().id_token)
    storage.set(
      GROUNDBE_USER_INFO,
      JSON.stringify({
        name: googleUser.getBasicProfile().getName(),
        profileImage: googleUser.getBasicProfile().getImageUrl()
      })
    )

    window.location.href = "/main"
  }

  private onFailure = (error: any) => {
    console.error(error)
    Alert(LOGIN_MSG.title_fail, LOGIN_MSG.login_fail)
  }

  private initAuth = async () => {
    const gapiInit = () => {
      window.gapi.load("auth2", function() {
        // Renew the singleton for the GoogleAuth library and set up the client.
        window.gapi.auth2.init({
          client_id: GOOGLE_AUTH_CLIENT_ID,
          cookiepolicy: "single_host_origin",
          // Request scopes in addition to 'profile' and 'email'
          scope: "profile email"
        })
      })
    }

    if (!window.gapi) {
      let gapiScript = document.createElement("script")
      gapiScript.async = true
      gapiScript.defer = true
      gapiScript.src = "https://apis.google.com/js/platform.js"
      gapiScript.onload = () => {
        gapiInit()
      }
    } else if (!window.gapi.auth2) {
      gapiInit()
    }
  }

  renderGoogleBtn = () => {
    const renderBtn = () => {
      window.gapi.signin2 &&
        window.gapi.signin2.render("google-render-btn", {
          scope: "profile email",
          width: 240,
          height: 50,
          longtitle: true,
          theme: "dark",
          onsuccess: this.onSuccess,
          onfailure: this.onFailure
        })
    }

    if (!window.gapi) {
      this.initAuth().then(() => {
        setTimeout(() => {
          renderBtn()
        }, 1000)
      })
    } else {
      renderBtn()
    }
  }

  logOut() {
    if (!window || !window.gapi) return

    const googleLogOut = () => {
      storage.remove(GROUNDBE_AUTH_TOKEN)
      storage.remove(GROUNDBE_USER_INFO)

      window.gapi.auth2
        .getAuthInstance()
        .signOut()
        .then(() => {
          window.location.href = "/"
        })
    }

    if (!window.gapi.auth2) {
      this.initAuth().then(() => {
        setTimeout(() => {
          googleLogOut()
        }, 1000)
      })
    } else {
      googleLogOut()
    }
  }

  async verify() {
    // Create gapi.auth2 instance
    this.initAuth().then(() => {
      const token = storage.get(GROUNDBE_AUTH_TOKEN)
      const pathName = window.location.pathname

      // If token does not exist let user to login by cliciking button
      if (!token) return

      // If token does not exist and Pathname is not login, then redirect to login page
      if (!token && (pathName !== "/" && pathName !== "/login")) {
        window.location.href = "/"
        return
      } else {
        const axios: AxiosInstance = Axios.create()

        axios
          .get(`${GOOGLE_TOKEN_VERIFY_URL}${token}`)
          .then(response => {
            window &&
              storage.set(
                GROUNDBE_USER_INFO,
                JSON.stringify({
                  name: response.data.name,
                  profileImage: response.data.picture
                })
              )
          })
          .catch(() => {
            // Catch when Token expired
            Alert(LOGIN_MSG.title_fail, LOGIN_MSG.verify_fail_expired)
            try {
              // Retreiving New token from google
              window.gapi.auth2
                .getAuthInstance()
                .currentUser.get()
                .reloadAuthResponse()
                .then((res: LooseObject) => {
                  storage.set(GROUNDBE_AUTH_TOKEN, res.id_token)
                  setTimeout(() => {
                    window && window.location.reload(true)
                  }, 2000)
                })
            } catch (e) {
              storage.remove(GROUNDBE_AUTH_TOKEN)
              storage.remove(GROUNDBE_USER_INFO)
              console.log("token error:", e)
            }
          })
      }
    })
  }
}

const oAuth = new OAuth()

export default oAuth
