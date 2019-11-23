import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import { Menu, Icon } from "antd"

import "./Menu.scss"

const { SubMenu } = Menu

interface SelectParam {
  key: string
  keyPath: Array<string>
  item: any
  domEvent: Event
}

function MenuComp() {
  const history = useHistory()

  const [currentMenu, setCurrentMenu] = useState("")

  const menuClickHanlder = (e: SelectParam) => {
    switch (e.key) {
      case "matchPreview":
        history.push("/match-preview")
        break
      case "liveScore":
        history.push("/match-livescore")
        break
      case "leagueMgmt":
        history.push("/league-mgmt")
        break
      case "teamMgmt":
        history.push("/team-mgmt")
        break
      case "protoMatchmap":
        history.push("/proto-matchmap")
        break
      case "protoScoreMgmt":
        history.push("/proto-score")
        break
      case "userMgmt":
        history.push("/user-mgmt")
        break

      default:
        history.push("/main")
    }
  }

  return (
    <div className="menu__container">
      <Menu
        onClick={menuClickHanlder}
        selectedKeys={[currentMenu]}
        mode="horizontal"
      >
        <SubMenu
          title={
            <span className="menu submenu-title-wrapper">
              <Icon type="dribbble" />
              Match
            </span>
          }
        >
          <Menu.ItemGroup
            title="MatchPreview"
            onClick={() => history.push("/match-preview")}
          >
            <Menu.Item key="matchPreview">Preview Management</Menu.Item>
            <Menu.Item key="liveScore">Live Score</Menu.Item>
          </Menu.ItemGroup>
        </SubMenu>

        <SubMenu
          title={
            <span className="menu submenu-title-wrapper">
              <Icon type="search" />
              League / Team
            </span>
          }
        >
          <Menu.ItemGroup title="League">
            <Menu.Item key="leagueMgmt">League Management</Menu.Item>
          </Menu.ItemGroup>
          <Menu.ItemGroup title="Team">
            <Menu.Item key="teamMgmt">Team Management</Menu.Item>
          </Menu.ItemGroup>
        </SubMenu>

        <SubMenu
          title={
            <span className="menu submenu-title-wrapper">
              <Icon type="profile" />
              Proto
            </span>
          }
        >
          <Menu.ItemGroup title="Proto">
            <Menu.Item key="protoMatchmap">Match Map Management</Menu.Item>
            <Menu.Item key="protoScoreMgmt">Score Management</Menu.Item>
          </Menu.ItemGroup>
        </SubMenu>

        <SubMenu
          title={
            <span className="menu submenu-title-wrapper">
              <Icon type="user" />
              General
            </span>
          }
        >
          <Menu.ItemGroup title="User Management">
            <Menu.Item key="userMgmt">Users</Menu.Item>
          </Menu.ItemGroup>
        </SubMenu>
      </Menu>
    </div>
  )
}

export default MenuComp
