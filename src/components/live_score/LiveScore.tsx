import React, { useEffect, useState } from "react"
import {
  Table,
  Button,
  DatePicker,
  Select,
  Input,
  InputNumber,
  Modal
} from "antd"
import moment from "moment"
import { getCurrentDate, LooseObject, getPeriodList } from "lib/help"

const { Option } = Select

import "./LiveScore.scss"

interface Props {
  initData: LooseObject[] | null
  setLiveScoreDataList: Function
  updateLiveScore: Function
}

function LiveScore({ initData, setLiveScoreDataList, updateLiveScore }: Props) {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id"
    },
    {
      title: "Sports",
      dataIndex: "sports",
      key: "sports"
    },
    {
      title: "Period",
      dataIndex: "period",
      key: "period",
      // @ts-ignore: Unreachable code error
      render: (text: string | undefined, item: LooseObject) => {
        return (
          <Select
            defaultValue={item.rawData.period}
            style={{ width: 110 }}
            onChange={(value: string) => (item.period = value)}
          >
            {periodList[item.sports].map((period, index) => {
              return (
                <Option key={`${item.id}_${index}`} value={period}>
                  {period}
                </Option>
              )
            })}
          </Select>
        )
      }
    },
    {
      title: "Home",
      dataIndex: "home",
      key: "home"
    },
    {
      title: "Score",
      dataIndex: "home_score",
      key: "home_score",
      // @ts-ignore: Unreachable code error
      render: (text: string | undefined, item: LooseObject) => {
        return (
          <>
            <InputNumber
              defaultValue={item.home_score}
              onChange={value => (item.home_score = value)}
            />
          </>
        )
      }
    },
    {
      title: "Score",
      dataIndex: "away_score",
      key: "away_score",
      // @ts-ignore: Unreachable code error
      render: (text: string | undefined, item: LooseObject) => {
        return (
          <>
            <InputNumber
              defaultValue={item.away_score}
              onChange={value => (item.away_score = value)}
            />
          </>
        )
      }
    },
    {
      title: "Away",
      dataIndex: "away",
      key: "away"
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      // @ts-ignore: Unreachable code error
      render: (text: string | undefined, item: LooseObject) => {
        return (
          <Select
            defaultValue={item.status}
            style={{ width: 100 }}
            onChange={(value: string) => (item.status = value)}
          >
            <Option value={"DONE"}>DONE</Option>
            <Option value={"READY"}>READY</Option>
            <Option value={"DURING"}>DURING</Option>
            <Option value={"CANCEL"}>CANCEL</Option>
            <Option value={"DELAY"}>DELAY</Option>
          </Select>
        )
      }
    },

    {
      title: "Source",
      dataIndex: "source",
      key: "source"
    },
    {
      title: "Source ID",
      dataIndex: "source_id",
      key: "source_id"
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      // @ts-ignore: Unreachable code error
      render: (text: string | undefined, item: LooseObject) => {
        return (
          <Button type="primary" onClick={() => updateLiveScore(item)}>
            Update
          </Button>
        )
      }
    },
    {
      title: "Extra",
      dataIndex: "extra",
      key: "extra",
      // @ts-ignore: Unreachable code error
      render: (text: string | undefined, item: LooseObject) => {
        if (item.rawData.sub_data !== null) {
          return (
            <Button
              icon="file-text"
              type="default"
              onClick={() => showModal(item.rawData.sub_data)}
            />
          )
        }
      }
    }
  ]

  const periodList = getPeriodList()
  const [dataTableSource, setTableDataSource] = useState<any[]>([])
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"))
  const [sports, setSports] = useState("ALL")
  const [status, setStatus] = useState("ALL")
  const [modalVisibility, setModalVisibility] = useState(false)
  const [subData, setSubData] = useState("")

  useEffect(() => {
    const dataSource = getTableDataSource()
    if (dataSource !== null) setTableDataSource(dataSource)
  }, [initData])

  const getTableDataSource = () => {
    if (initData !== null) {
      return initData.map((item: LooseObject) => {
        return {
          key: `${item.id}_${item.period}_${item.home_score}_${item.away_score}_${item.status}`,
          id: item.id,
          sports: item.sports,
          period: item.period,
          home:
            item.matchteam[0] && item.matchteam[0].type === "HOME"
              ? item.matchteam[0].teamInfo.name
              : item.matchteam[1].teamInfo.name,
          home_score: item.home_score,
          away_score: item.away_score,
          away:
            item.matchteam[1] && item.matchteam[1].type === "AWAY"
              ? item.matchteam[1].teamInfo.name
              : item.matchteam[0].teamInfo.name,
          status: item.status,
          source: item.source_type,
          source_id: item.source_id,
          rawData: item
        }
      })
    }
    return null
  }

  const dateChange = (date: moment.Moment | null, dateString: string) => {
    date && dateString && setDate(moment(dateString).format("YYYY-MM-DD"))
  }

  const showModal = (data: string) => {
    const JsonFormatSubData = JSON.parse(data)
    const subData = JSON.stringify(JsonFormatSubData, null, 2)

    setSubData(subData)
    setModalVisibility(true)
  }

  return (
    <>
      <DatePicker
        className="match__preview__datepicker"
        onChange={dateChange}
        defaultValue={moment(getCurrentDate(), "YYYY-MM-DD")}
        allowClear={false}
      />

      <Select
        defaultValue="ALL"
        style={{ width: 120 }}
        onChange={(value: string) => setSports(value)}
      >
        <Option value="ALL">ALL</Option>
        <Option value="BASKETBALL">BASKETBALL</Option>
        <Option value="BASEBALL">BASEBALL</Option>
        <Option value="SOCCER">SOCCER</Option>
        <Option value="VOLLEYBALL">VOLLEYBALL</Option>
      </Select>

      <Select
        className="select__status"
        defaultValue="ALL"
        style={{ width: 120 }}
        onChange={(value: string) => setStatus(value)}
      >
        <Option value="ALL">ALL</Option>
        <Option value="DONE">DONE</Option>
        <Option value="READY">READY</Option>
        <Option value="DURING">DURING</Option>
        <Option value="CANCEL">CANCEL</Option>
        <Option value="DELAY">DELAY</Option>
      </Select>

      <Button
        type="primary"
        icon="search"
        onClick={() => setLiveScoreDataList(date, sports, status)}
      />

      <Table
        dataSource={dataTableSource}
        columns={columns}
        pagination={{ pageSize: 20, position: "top" }}
        bordered
      />

      <Modal
        title="Sub Data"
        visible={modalVisibility}
        onCancel={() => setModalVisibility(false)}
        footer={null}
      >
        <pre>{subData}</pre>
      </Modal>
    </>
  )
}

export default LiveScore
