import React, { useState, useEffect } from "react"
import { TypeProtoGameInfo, TypeProto } from "lib/api/proto"
import { InputNumber, Button, Table, Tag, Divider } from "antd"

import "./ProtoScoreMgmt.scss"
import { LooseObject } from "lib/help"

interface Props {
  initData: TypeProtoGameInfo
  updateProtoScore: Function
  updateProtoGameInfo: Function
}

function ProtoScoreMgmt({
  initData,
  updateProtoScore,
  updateProtoGameInfo
}: Props) {
  const columns = [
    {
      title: "Seq",
      dataIndex: "seq",
      key: "seq"
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status"
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type"
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description"
    },

    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      // @ts-ignore: Unreachable code error
      render: (text: string | undefined, item: LooseObject) => {
        if (editableRowKey === item.key) {
          // When editing
          if (item.rawData.type === "UNOVER") {
            // When editing & When UNOVER
            return (
              <>
                <InputNumber
                  className="input__number--home"
                  size="small"
                  value={homeScore}
                  onChange={value => setHomeScore(value)}
                />
                <span>Under Over</span>
              </>
            )
          } else {
            return (
              // When editing & When NOT UNOVER
              <>
                <InputNumber
                  className="input__number--home"
                  size="small"
                  value={homeScore}
                  onChange={value => setHomeScore(value)}
                />
                <span>
                  {item.rawData.home_team} : {item.rawData.away_team}
                </span>
                <InputNumber
                  className="input__number--away"
                  size="small"
                  value={awayScore}
                  onChange={value => setAwayScore(value)}
                />
              </>
            )
          }
        } else {
          // When NOT Editing
          if (item.rawData.type === "UNOVER") {
            // When NOT Editing & Unover
            return (
              <>
                <InputNumber
                  className="input__number--home"
                  size="small"
                  value={item.rawData.home_score}
                  disabled={true}
                />
                <span>Under Over</span>
              </>
            )
          } else {
            // When NOT Editing & NOT Unover
            return (
              <>
                <InputNumber
                  className="input__number--home"
                  size="small"
                  value={item.rawData.home_score}
                  disabled={true}
                />
                <span>
                  {item.rawData.home_team} : {item.rawData.away_team}
                </span>
                <InputNumber
                  className="input__number--away"
                  size="small"
                  value={item.rawData.away_score}
                  disabled={true}
                />
              </>
            )
          }
        }
      }
    },
    {
      title: "Action",
      key: "action",
      // @ts-ignore: Unreachable code error
      render: (text: string | undefined, item: LooseObject) => {
        if (editableRowKey === item.key) {
          return (
            <>
              <span
                key={`${item.id}_confirm`}
                className="input__confirm"
                onClick={() => updateProtoScoreInfo(item, true)}
              >
                Confirm
              </span>
              <Divider type="vertical" />
              <span
                key={`${item.id}_cancel`}
                className="input__cancel"
                onClick={() => updateProtoScoreInfo(item, false)}
              >
                Cancel
              </span>
            </>
          )
        } else if (isEditing) {
          return (
            <div key={`${item.id}_disabled`} className="input__edit__disabled">
              Edit
            </div>
          )
        } else {
          return (
            <div
              key={item.id}
              className="input__edit"
              onClick={() => setEditableInputKey(item)}
            >
              Edit
            </div>
          )
        }
      }
    }
  ]

  const [protoList, setProtoList] = useState<TypeProto[]>([])
  const [dataTableSource, setTableDataSource] = useState<any[]>([])
  const [currentRound, setCurrentRound] = useState<number | undefined>(0)
  const [isEditing, setIsEditing] = useState(false)
  const [editableRowKey, setEditableRowKey] = useState(-1)
  const [homeScore, setHomeScore] = useState<number | undefined>(0)
  const [awayScore, setAwayScore] = useState<number | undefined>(0)

  useEffect(() => {
    initData.protos.length && setProtoList(initData.protos)
    initData.protos.length && setCurrentRound(parseInt(initData.round))
  }, [initData])

  useEffect(() => {
    setTableDataSource(getTableDataSource())
  }, [protoList])

  const getTableDataSource = () => {
    return protoList.map((item: LooseObject, index) => {
      return {
        key: index + 1,
        seq: item.seq,
        status: item.status,
        type: <Tag>{item.type}</Tag>,
        description: item.description,
        rawData: item
      }
    })
  }

  const updateProtoScoreInfo = (info: LooseObject, submit: boolean) => {
    if (submit) {
      updateProtoScore(info.rawData.id, homeScore, awayScore, currentRound)
    }
    setIsEditing(false)
    setEditableRowKey(-1)
    setHomeScore(0)
    setAwayScore(0)
  }

  const getProtoGameInfo = (round: number | undefined) => {
    const year = new Date().getFullYear()
    updateProtoGameInfo(round, year)
  }

  const setEditableInputKey = (item: LooseObject) => {
    setHomeScore(item.rawData.home_score)
    setAwayScore(item.rawData.away_score)
    setIsEditing(true)
    setEditableRowKey(item.key)
  }

  return (
    <>
      <div className="proto__score__header">
        Proto Game Round
        {
          <InputNumber
            className="input__number"
            size="small"
            min={1}
            max={999}
            value={currentRound}
            onChange={value => setCurrentRound(value)}
          />
        }
        <Button
          type="primary"
          shape="circle"
          icon="search"
          size="small"
          onClick={() => getProtoGameInfo(currentRound)}
        />
      </div>

      <Table
        dataSource={dataTableSource}
        columns={columns}
        pagination={{ pageSize: 20, position: "top" }}
      >
        <span>test</span>
      </Table>
    </>
  )
}

export default ProtoScoreMgmt
