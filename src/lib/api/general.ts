import client from "lib/client"
import { LooseObject } from "lib/help"

import { USER_MSG } from "constants/messages"
import { Alert } from "components/common"

async function getUserList() {
  return await client.get("/contents/user?withPermission=true")
}

async function updateUserPermission(
  user: LooseObject,
  updatingPermission: string
) {
  let { id, email, permission } = user

  if (permission === updatingPermission) {
    Alert(USER_MSG.user_info_update, USER_MSG.user_info_update_fail_identical)
    console.log(
      `updateUser: permission is wrong ==> ${permission}[${typeof permission}]`
    )
    return Promise.reject()
  } else {
    permission = updatingPermission
  }

  return await client.post("/contents/user", { id, email, permission })
}

async function updateUserProfileImage(image: Blob, id: string) {
  if (id === undefined || typeof id !== "number") {
    return Promise.reject()
  }

  if (!image) {
    return Promise.reject()
  }

  const formData = new FormData()
  formData.append("image", image)
  formData.append("id", id)

  return client.post("/contents/user/profile/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
}

async function deleteUserProfile(id: string) {
  if (id === undefined || id === "") {
    return Promise.reject()
  }
  return client.delete("/contents/user/profile", { data: { id } })
}

async function updateUserProfile(user: LooseObject) {
  const { name, title, language } = user
  const user_id = user.userInfo.id
  const id = user.profile.id

  return client.post("contents/user/profile", {
    id,
    user_id,
    language,
    name,
    title
  })
}

async function addNewUserProfile(
  user_id: number,
  language: string,
  name: string,
  title: string
) {
  return client.post("/contents/user/profile", {
    user_id,
    language,
    name,
    title
  })
}

export default {
  getUserList,
  updateUserPermission,
  updateUserProfileImage,
  deleteUserProfile,
  updateUserProfile,
  addNewUserProfile
}
