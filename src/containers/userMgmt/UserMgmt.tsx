import React, { useState, useEffect } from "react"

import { UserMgmt } from "components"
import { LoadingBar } from "components/common"
import { General } from "lib/api"
import { LooseObject } from "lib/help"
import { USER_MSG } from "constants/messages"
import { Alert } from "components/common"

function UserMgmtContainer() {
  const [initData, setInitData] = useState<Object[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    setLoading(true)
    General.getUserList()
      .then(response => {
        setLoading(false)
        setError(false)
        setInitData(response.data)
      })
      .catch(e => {
        console.error(`[getUserList ERROR]\n${e}`)
        setError(true)
      })
  }

  const updateUserPermission = (user: LooseObject, permission: string) => {
    General.updateUserPermission(user, permission)
      .then(response => {
        if (response.status === 200) {
          Alert(USER_MSG.user_info_update, USER_MSG.user_info_update_success)
          fetchData()
        }
      })
      .catch(e => {
        console.error(`[updateUserPermission ERROR]\n${e}`)
        setError(true)
      })
  }

  const updateUserImage = (info: LooseObject) => {
    General.updateUserProfileImage(info.file, info.data.id)
      .then(response => {
        if (response.status === 200) {
          Alert(USER_MSG.user_info_update, USER_MSG.user_image_update_success)
          fetchData()
        }
      })
      .catch(e => {
        console.error(`[updateUserImage ERROR]\n${e}`)
        setError(true)
      })
  }

  const deleteUserProfile = (user: LooseObject) => {
    General.deleteUserProfile(user.profile.id)
      .then(() => {
        Alert(USER_MSG.user_info_update, USER_MSG.user_profile_delete_success)
        fetchData()
      })
      .catch(e => {
        console.error(`[deleteUserProfile ERROR]\n${e}`)
        setError(true)
      })
  }

  const updateUserProfile = (user: LooseObject) => {
    General.updateUserProfile(user)
      .then(() => {
        Alert(USER_MSG.user_info_update, USER_MSG.user_profile_updated_success)
      })
      .catch(e => {
        console.error(`[updateUserProfile ERROR]\n${e}`)
        setError(true)
      })
  }

  const addNewUserProfile = (
    id: number,
    language: string,
    name: string,
    title: string
  ) => {
    General.addNewUserProfile(id, language, name, title)
      .then(() => {
        Alert(USER_MSG.user_info_update, USER_MSG.user_profile_updated_success)
        fetchData()
      })
      .catch(e => {
        console.error(`[updateUserProfile ERROR]\n${e}`)
        setError(true)
      })
  }

  return (
    <>
      {loading && <LoadingBar />}
      {error && <p style={{ textAlign: "center" }}>Error</p>}
      {initData !== null && (
        <UserMgmt
          initData={initData}
          updateUserPermission={updateUserPermission}
          updateUserImage={updateUserImage}
          deleteProfile={deleteUserProfile}
          updateProfile={updateUserProfile}
          addNewProfile={addNewUserProfile}
        />
      )}
    </>
  )
}

export default UserMgmtContainer
