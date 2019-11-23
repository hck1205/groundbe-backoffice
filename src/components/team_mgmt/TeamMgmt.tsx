import React, { useState, useEffect } from "react"
import { Tag, Collapse, Table, Input, Button, Upload, Icon, Select } from "antd"
import { Alert } from "components/common"

import { LooseObject, copyText } from "lib/help"
import { THUMBNAIL_BASE_URL } from "constants/variables"

import "./TeamMgmt.scss"

const { CheckableTag } = Tag
const { Panel } = Collapse
const { Search } = Input
const { Option } = Select

interface Props {
  nationList: LooseObject
  teamList: LooseObject
  updateTeamList: Function
  updateTeamInfo: Function
  updateTeamLogoImage: Function
  searchTeamList: Function
}

function TeamMgmt({
  nationList,
  teamList,
  updateTeamList,
  updateTeamInfo,
  updateTeamLogoImage,
  searchTeamList
}: Props) {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id"
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      // @ts-ignore: Unreachable code error
      render: (text: string | undefined, item: LooseObject) => {
        return (
          <>
            <Button
              className="teamname__copy__button"
              type="default"
              icon="copy"
              onClick={() => copyText(item.rawData.name)}
            />
            {item.rawData.name}
          </>
        )
      }
    },
    {
      title: "Sports",
      dataIndex: "sports",
      key: "sports"
    },
    {
      title: "League",
      dataIndex: "league",
      key: "league"
    },

    {
      title: "Name (KR)",
      dataIndex: "name_kr",
      key: "name_kr",
      // @ts-ignore: Unreachable code error
      render: (text: string | undefined, item: LooseObject) => {
        return (
          <Input
            key={`${item.id}_name_kr`}
            defaultValue={item.name_kr}
            onChange={e => (item.name_kr = e.target.value)}
          />
        )
      }
    },
    {
      title: "Abbreviation",
      dataIndex: "abbreviation",
      key: "abbreviation",
      // @ts-ignore: Unreachable code error
      render: (text: string | undefined, item: LooseObject) => {
        return (
          <Input
            key={`${item.id}_abbreviation`}
            defaultValue={item.abbreviation}
            onChange={e => (item.abbreviation = e.target.value)}
          />
        )
      }
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      // @ts-ignore: Unreachable code error
      render: (text: string | undefined, item: LooseObject) => {
        return (
          <span
            key={`${item.id}_confirm`}
            className="input__confirm"
            onClick={() => updateTeamInfo(item)}
          >
            Update
          </span>
        )
      }
    },
    {
      title: "Logo",
      dataIndex: "logo",
      key: "logo",
      width: 80,
      // @ts-ignore: Unreachable code error
      render: (text: string | undefined, item: LooseObject) => {
        const uploadButton = () => {
          return (
            <div>
              <Icon
                type={
                  uploadingKey === item.id && isUploading ? "loading" : "plus"
                }
              />
              <div className="ant-upload-text">Upload</div>
            </div>
          )
        }
        return (
          <Upload
            name="team-logo"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            accept=".jpg,.jpeg,.png"
            data={item}
            customRequest={uploadLogo}
          >
            {item.logo_path ? (
              <img
                src={`${THUMBNAIL_BASE_URL}${item.logo_path}`}
                alt="avatar"
                style={{ width: "100%" }}
              />
            ) : (
              uploadButton()
            )}
          </Upload>
        )
      }
    }
  ]

  const [searchFilter, setSearchFilter] = useState("team")
  const [currentPage, setCurrentPage] = useState(1)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadingKey, setUploadingKey] = useState(-1)
  const [dataTableSource, setTableDataSource] = useState<any[]>([])
  const [selectedNation, setSelectedNation] = useState("")
  const [selectedLeague, setSelectedLeague] = useState("")
  const [selectedNationLeagueList, setSelectedNationLeagueList] = useState([])
  const [panelActiveKey, setPanelActivekey] = useState<string | string[]>(["0"])

  useEffect(() => {
    if (nationList["ALL"] && nationList["ALL"].length > 0) {
      setPanelActivekey(["1"])
    }
  }, [nationList])

  useEffect(() => {
    setTableDataSource(getTableDataSource())
    setUploadingKey(-1)
    setCurrentPage(1)
  }, [teamList])

  const getTableDataSource = () => {
    return teamList.map((item: LooseObject, index: number) => {
      return {
        key: index,
        id: item.id,
        sports: item.sports
          ? item.sports
          : item.matchteam && item.matchteam.match.league.sports,
        league: item.league_name
          ? item.league_name
          : item.matchteam && item.matchteam.match.league.name,
        name_kr: item.name_kr,
        abbreviation: item.abbreviation,
        logo_path: item.logo_path,
        rawData: item
      }
    })
  }

  const selectNation = (nation: LooseObject, checked: boolean) => {
    if (checked) {
      setSelectedNation(nation[0])
      setSelectedNationLeagueList(nation[1])
      setPanelActivekey(["1", "2"])
    }
  }

  const selectLeague = (league: LooseObject, checked: boolean) => {
    if (checked && selectedLeague !== `${league["name"]}_${league["id"]}`) {
      setSelectedLeague(`${league["name"]}_${league["id"]}`)
      updateTeamList(league["id"])
    }
  }

  const uploadLogo = (info: LooseObject) => {
    setUploadingKey(info.data.id)
    setIsUploading(true)
    updateTeamLogoImage(info)
  }

  const searchTeams = (keyword: string | undefined) => {
    if (keyword && keyword.length < 2) {
      Alert("Search Error", "Please type more than 2 letters")
      return
    }
    setSelectedNation("")
    setSelectedLeague("")
    searchTeamList(keyword, searchFilter)
  }

  return (
    <div className="team__mgmt__container">
      <div className="search__box__container">
        <Select
          defaultValue={searchFilter}
          style={{ width: 120, marginRight: 20 }}
          onChange={(value: string) => setSearchFilter(value)}
        >
          <Option value="team">TEAM</Option>
          <Option value="league">LEAGUE</Option>
          <Option value="name_kr">NAME(KR)</Option>
        </Select>

        <Search
          className="search__box"
          placeholder="Please type team names to search"
          onSearch={keyword => keyword && searchTeams(keyword)}
          allowClear
          enterButton
        />
      </div>

      <Collapse
        activeKey={panelActiveKey}
        onChange={key => setPanelActivekey(key)}
      >
        <Panel header="Nation List" key="1">
          {Object.entries(nationList).map((item, index) => {
            const isSelected = selectedNation === item[0]
            return (
              <CheckableTag
                className={isSelected ? "selected__nation__tag" : "nation__tag"}
                key={`${item[0]}_${index}`}
                checked={isSelected}
                onChange={checked => selectNation(item, checked)}
              >
                {item[0]}
              </CheckableTag>
            )
          })}
        </Panel>
        <Panel header="Nation Leagues" key="2">
          {selectedNation !== ""
            ? selectedNationLeagueList.map((item, index) => {
                const isSelected =
                  selectedLeague === `${item["name"]}_${item["id"]}`
                return (
                  <CheckableTag
                    className={
                      isSelected ? "selected__league__tag" : "league__tag"
                    }
                    key={`${item["name"]}_${index}`}
                    checked={isSelected}
                    onChange={checked => selectLeague(item, checked)}
                  >
                    {item["name"]}
                  </CheckableTag>
                )
              })
            : "Please select country first"}
        </Panel>
      </Collapse>

      <div className="team__mgmt__table__container">
        <Table
          className="team__mgmt__table"
          dataSource={dataTableSource}
          columns={columns}
          pagination={{
            pageSize: 20,
            position: "top",
            current: currentPage,
            onChange: (page: number) => setCurrentPage(page)
          }}
          bordered
        />
      </div>
    </div>
  )
}

export default TeamMgmt
