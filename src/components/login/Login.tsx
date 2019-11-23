import React, { useEffect } from "react"
import { Responsive } from "components/common"
import OAuth from "lib/auth"

import "./Login.scss"

function Login() {
  useEffect(() => {
    OAuth.renderGoogleBtn()
  }, [])

  return (
    <Responsive className="login__container">
      <div className="background--image">
        <div className="background--mid__container">
          <div className="text__container">Groundbe Backoffice</div>
          <div className="google__btn__container">
            <div id="google-render-btn" />
          </div>
        </div>
      </div>
    </Responsive>
  )
}

export default Login
