import React, { useEffect, useState, useMemo, useCallback } from "react"
import {
  Table,
  Modal,
  Input,
  Typography,
  Select,
  DatePicker,
  message,
  Tag,
  Button
} from "antd"
import moment from "moment"

import {
  convertISOToDate,
  LooseObject,
  makeDescription,
  getCurrentDate
} from "lib/help"
import { Match } from "lib/api"
import { TypeMatchPreview, TypeMatchPreviewInfo } from "lib/api/match"
import { MATCH_MSG } from "constants/messages"

import { Alert } from "components/common"
import StatisticsPanel from "./StatisticsPanel"

import "./MatchPreview.scss"

const { TextArea } = Input
const { Text } = Typography
const { Option } = Select

interface Props {
  initData: TypeMatchPreviewInfo
  userListAsOptionTag: JSX.Element[] | JSX.Element
  updateDataByDate: Function
}

function MatchPreview({
  initData,
  userListAsOptionTag,
  updateDataByDate
}: Props) {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id"
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date"
    },
    {
      title: "Sports",
      dataIndex: "sports",
      key: "sports"
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description"
    },

    {
      title: "Home",
      dataIndex: "home",
      key: "home"
    },
    {
      title: "Away",
      dataIndex: "away",
      key: "Away"
    },
    {
      title: "Language",
      dataIndex: "language",
      key: "language"
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status"
    },
    {
      title: "Action",
      key: "action",
      render: (item: string | number) => {
        return (
          <Button type="primary" onClick={() => displayModal(item)}>
            Update
          </Button>
        )
      }
    }
  ]

  const { languages, matchPreviewList, userList } = initData
  const [dataTableSource, setTableDataSource] = useState<any[]>([])
  const [modalTitle, setModalTitle] = useState("")
  const [isModalVisible, setModalVisible] = useState(false)
  const [activeKey, setActivekey] = useState(-1)
  const [homeComment, setHomeComment] = useState("")
  const [awayComment, setAwayComment] = useState("")
  const [status, setStatus] = useState("")
  const [currentMatchPreviewList, setCurrentMatchPreviewList] = useState(
    matchPreviewList
  )

  // When initData changes by calling updateDatabyDate invoke useEffect
  useEffect(() => {
    setCurrentMatchPreviewList(matchPreviewList)
  }, [initData])

  // When writerFilter is called then invoke useEffect
  useEffect(() => {
    setTableDataSource(getTableDataSource())
  }, [currentMatchPreviewList])

  const getTableDataSource = () => {
    return currentMatchPreviewList.map((item: LooseObject, index) => {
      return {
        key: index + 1,
        id: getTableRowUserId(item.user_id),
        date: convertISOToDate(item.created_at),
        sports: item.match ? item.match.sports : "",
        description: item.match ? makeDescription(item.match) : "",
        home: item.home_score,
        away: item.away_score,
        language: item.language,
        status: item.status
      }
    })
  }

  // Find user id in UserList
  const getTableRowUserId = (userId: number) => {
    const element: LooseObject | undefined = userList.find(
      (element: LooseObject) => {
        return element.id.toString() === userId
      }
    )
    return element ? element.email : userId
  }

  const displayModal = (item: any) => {
    const currentData: TypeMatchPreview = currentMatchPreviewList[item.key - 1]

    setActivekey(item.key - 1)
    setHomeComment(currentData.home_comment)
    setAwayComment(currentData.away_comment)
    setModalTitle(item.description)
    setModalVisible(true)
    setStatus(item.status)
  }

  const updateMatchPreview = () => {
    const data: TypeMatchPreview = currentMatchPreviewList[activeKey]
    data.home_comment = homeComment
    data.away_comment = awayComment
    data.status = status

    const hideMessage = message.loading(MATCH_MSG.match_preview_update, 0)

    Match.postMatchPreview(data)
      .then(() => {
        setModalVisible(false)
        setTimeout(hideMessage, 100)
      })
      .catch(e => {
        console.error(e)
        Alert(
          MATCH_MSG.title_match_preview_update,
          MATCH_MSG.match_preview_update_fail
        )
        setTimeout(hideMessage, 100)
      })
  }

  // Select MatchPreview Date
  const onDateChange = (date: moment.Moment | null, dateString: string) => {
    date && dateString && updateDataByDate(dateString)
  }

  // show only match preview that matches with user id
  const filterWriter = (userId: string | number) => {
    if (userId === "all") {
      setCurrentMatchPreviewList(matchPreviewList)
    } else {
      let filteredData = matchPreviewList.filter(
        (matchPreview: LooseObject) => {
          return matchPreview.user_id === userId.toString()
        }
      )
      setCurrentMatchPreviewList(filteredData)
    }
  }

  const getCountSports = useMemo(() => {
    const sports: LooseObject = {
      Total: 0
    }

    currentMatchPreviewList.map((matchPreivew: LooseObject) => {
      if (sports.hasOwnProperty(matchPreivew.match.sports)) {
        sports[matchPreivew.match.sports] += 1
      } else {
        sports[matchPreivew.match.sports] = 1
      }
      sports["Total"]++
    })

    return Object.entries(sports).map((item, index) => {
      return (
        <Tag key={`${item[0]}_${index}`} className="count__sports">
          {item[0]} : {item[1]}
        </Tag>
      )
    })
  }, [dataTableSource])

  return (
    <>
      <DatePicker
        className="match__preview__datepicker"
        onChange={onDateChange}
        defaultValue={moment(getCurrentDate(), "YYYY-MM-DD")}
        allowClear={false}
      />

      <Select defaultValue="ALL" style={{ width: 200 }} onChange={filterWriter}>
        <Option value={"all"}>ALL</Option>
        {userListAsOptionTag}
      </Select>

      <StatisticsPanel />

      <div className="count__sports__container">{getCountSports}</div>

      <Modal
        title={modalTitle}
        visible={isModalVisible}
        onOk={updateMatchPreview}
        onCancel={() => setModalVisible(false)}
        okText={"Update"}
        width={1000}
        bodyStyle={{ height: 500 }}
      >
        <Text code>Home</Text>
        <TextArea
          className="modal__textarea"
          rows={7}
          value={homeComment}
          onChange={e => setHomeComment(e.target.value)}
        />
        <Text code>Away</Text>
        <TextArea
          className="modal__textarea"
          rows={7}
          value={awayComment}
          onChange={e => setAwayComment(e.target.value)}
        />
        <div className="modal__select__container">
          <span>Status:</span>
          <Select
            defaultValue={status}
            style={{ width: 120 }}
            onChange={(value: string) => setStatus(value)}
          >
            <Option value="PUBLISH">PUBLISH</Option>
            <Option value="DISABLE">DISABLE</Option>
          </Select>
        </div>
      </Modal>

      <Table
        dataSource={dataTableSource}
        columns={columns}
        pagination={false}
      />
    </>
  )
}

export default MatchPreview
