import { notification } from "antd"

const openAlert = (msg: string, description: string) => {
  notification.open({
    message: msg,
    description: description,
    style: {
      width: 600,
      marginLeft: 300 - 600
    },
    duration: 2.5
  })
}

export default openAlert
