import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { Button } from "antd"

import OAuth from "lib/auth"
import { GROUNDBE_USER_INFO } from "constants/variables"
import storage from "lib/storage"
import { Menu } from "components"

import "./Header.scss"

const Header = () => {
  const history = useHistory()

  const [username, setUsername] = useState("")
  const [profileImage, setProfileImage] = useState("")

  useEffect(() => {
    // OAuth.verify()

    const userInfo = JSON.parse(storage.get(GROUNDBE_USER_INFO))
    if (userInfo === null) {
      OAuth.verify()
    } else {
      setUsername(userInfo.name)
      setProfileImage(userInfo.profileImage)
    }
  }, [])

  return (
    <header className="header__container">
      <div
        className="header--text"
        onClick={() => {
          history.push("/main")
        }}
      >
        Groundbe Backoffice
      </div>
      <div className="login__info__area">
        <img className="user--image" src={profileImage}></img>
        <div className="user--name">{username}</div>
        <Button
          className="btn--logout"
          type="danger"
          onClick={() => OAuth.logOut()}
        >
          Logout
        </Button>
      </div>
      <Menu />
    </header>
  )
}

export default Header
