import React, { useState, useEffect, useMemo, useCallback } from "react"
import {
  List,
  Avatar,
  Select,
  Button,
  Upload,
  Icon,
  Modal,
  Table,
  Popconfirm,
  Input
} from "antd"

import { LooseObject } from "lib/help"
import { THUMBNAIL_BASE_URL } from "constants/variables"

import "./UserMgmt.scss"

const { Option } = Select

interface Props {
  initData: LooseObject | null
  updateUserPermission: Function
  updateUserImage: Function
  deleteProfile: Function
  updateProfile: Function
  addNewProfile: Function
}

function UserMgmt({
  initData,
  updateUserPermission,
  updateUserImage,
  deleteProfile,
  updateProfile,
  addNewProfile
}: Props) {
  const columns = [
    {
      title: "Language",
      dataIndex: "language",
      key: "language"
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      // @ts-ignore: Unreachable code error
      render: (text: string, user: LooseObject) => {
        return (
          <Input
            key={`${user.id}_name`}
            defaultValue={user.name}
            onChange={e => (user.name = e.target.value)}
          />
        )
      }
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      // @ts-ignore: Unreachable code error
      render: (text: string, user: LooseObject) => {
        return (
          <Input
            key={`${user.id}_title`}
            defaultValue={user.title}
            onChange={e => (user.title = e.target.value)}
          />
        )
      }
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      // @ts-ignore: Unreachable code error
      render: (text: string, user: LooseObject) => {
        return (
          <Popconfirm
            title="Are you sure to update this profile?"
            onConfirm={() => updateProfile(user)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary">Update</Button>
          </Popconfirm>
        )
      }
    },
    {
      title: "Delete",
      dataIndex: "delete",
      key: "delete",
      // @ts-ignore: Unreachable code error
      render: (text: string, user: LooseObject) => {
        return (
          <Popconfirm
            title="Are you sure to delete this profile?"
            onConfirm={() => deleteProfile(user)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger">Delete</Button>
          </Popconfirm>
        )
      }
    }
  ]

  const [permission, setPermission] = useState<string[] | null>(null)
  const [language, setLanguage] = useState<string[] | null>(null)
  const [userList, setUserList] = useState<LooseObject[] | undefined>(undefined)
  const [activeKey, setActiveKey] = useState<LooseObject | null>(null)
  const [modalTitle, setModalTitle] = useState("")
  const [newProfileTitle, setNewProfileTitle] = useState("")
  const [newProfileName, setNewProfileName] = useState("")
  const [newProfileLang, setNewProfileLang] = useState("")
  const [activeUserInfo, setActiveUserInfo] = useState()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [tableDataSource, setTableDataSource] = useState()

  useEffect(() => {
    if (initData !== null) {
      setPermission(initData.permission)
      setLanguage(initData.profileLanguage)
      setUserList(initData.userList)
      setActiveKey(null)

      // Refresh data in Modal
      if (activeUserInfo) {
        const userId = activeUserInfo.id
        initData.userList.map((user: LooseObject) => {
          if (user.id === userId) {
            setTableDataSource(getTableDataSource(user))
            setActiveUserInfo(user)
          }
        })
      }
    }
  }, [initData])

  const updateActiveRow = (data: string) => {
    const [key, value] = data.split("-")
    let newObj: { [unit: string]: string } = {}
    newObj[key] = value

    if (activeKey !== null) {
      const newActiveKey = { ...activeKey, ...newObj }
      setActiveKey(newActiveKey)
    } else {
      setActiveKey(newObj)
    }
  }

  const showModal = (user: LooseObject) => {
    setIsModalVisible(true)
    setModalTitle(`${user.email}'s Profile`)
    setActiveUserInfo(user)
    setTableDataSource(getTableDataSource(user))
  }

  const cancelUpdateProfile = () => {
    setNewProfileLang("")
    setNewProfileName("")
    setNewProfileTitle("")
    setIsModalVisible(false)
  }

  const addNewUserProfile = () => {
    addNewProfile(
      activeUserInfo.id,
      newProfileLang,
      newProfileName,
      newProfileTitle
    )
    setNewProfileTitle("")
    setNewProfileName("")
    setNewProfileLang("")
  }

  const getTableDataSource = (user: LooseObject) => {
    return Object.entries(user.profiles).map((profile: LooseObject, index) => {
      return {
        key: index + 1,
        language: profile[1].language,
        name: profile[1].name,
        title: profile[1].title,
        profile: profile[1],
        userInfo: user
      }
    })
  }

  const getLanguageOption = () => {
    const user = activeUserInfo

    if (user) {
      const userLanguages = Object.keys(user.profiles)
      return (
        language !== null &&
        language
          .filter(lang => userLanguages.indexOf(lang) === -1)
          .map((lang, index) => {
            return (
              <Option key={`${lang}_${index}`} value={lang}>
                {lang}
              </Option>
            )
          })
      )
    }

    return null
  }

  return (
    <div>
      <div className="user__list__containter">
        <List
          itemLayout="horizontal"
          dataSource={userList}
          size="large"
          renderItem={(user, userIndex) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={
                      user.profile_image_path &&
                      `${THUMBNAIL_BASE_URL}${user.profile_image_path}`
                    }
                    size="large"
                    icon={"user"}
                  />
                }
                title={`${user.email}`}
                description={`${user.permission}`}
              />

              <Upload
                showUploadList={false}
                accept=".jpg,.jpeg,.png"
                data={user}
                customRequest={data => updateUserImage(data)}
              >
                <Button>
                  <Icon type="upload" /> Upload Image
                </Button>
              </Upload>

              <Button
                className="user__profile__button"
                type="primary"
                icon="profile"
                onClick={() => showModal(user)}
              />

              <div className="profile__notice__text__container">
                There is / are {Object.entries(user.profiles).length}{" "}
                profile(s).
              </div>

              <Select
                className="select__permisson"
                defaultValue={`${user.permission}`}
                style={{ width: 220 }}
                onChange={updateActiveRow}
              >
                {permission !== null ? (
                  permission.map((data: string) => {
                    return (
                      <Option
                        key={`${userIndex}_${data}`}
                        value={`${userIndex}-${data}`}
                      >
                        {data}
                      </Option>
                    )
                  })
                ) : (
                  <></>
                )}
              </Select>

              {activeKey !== null && activeKey.hasOwnProperty(userIndex) ? (
                <Button
                  type="primary"
                  onClick={() =>
                    updateUserPermission(user, activeKey[userIndex])
                  }
                >
                  Update
                </Button>
              ) : (
                <Button disabled={true}>Update</Button>
              )}
            </List.Item>
          )}
        />
      </div>

      <Modal
        title={modalTitle}
        visible={isModalVisible}
        onCancel={cancelUpdateProfile}
        footer={null}
        width={900}
        bodyStyle={{ height: 400 }}
      >
        <Select
          className="select__user--language"
          onChange={(value: string) => setNewProfileLang(value)}
          placeholder="Please select language"
          value={newProfileLang}
        >
          {useMemo(() => getLanguageOption(), [activeUserInfo])}
        </Select>
        <Input
          className="input__user--profile"
          type="text"
          placeholder="Please type user name"
          onChange={e => setNewProfileName(e.target.value)}
          value={newProfileName}
        />
        <Input
          className="input__user--profile"
          type="text"
          placeholder="Please type user title"
          onChange={e => setNewProfileTitle(e.target.value)}
          value={newProfileTitle}
        />
        <Button
          className="user__add__profile"
          type="primary"
          onClick={() => addNewUserProfile()}
        >
          Add
        </Button>
        {tableDataSource !== undefined ? (
          <Table
            columns={columns}
            dataSource={tableDataSource}
            pagination={false}
            scroll={{ y: 250 }}
          />
        ) : (
          <></>
        )}
      </Modal>
    </div>
  )
}

export default UserMgmt
