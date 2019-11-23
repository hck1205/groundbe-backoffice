import React, { FunctionComponent, useState, useEffect } from "react"

import { Drawer, Table, Button, Popconfirm } from "antd"
import { TypeMatchInfoInAHour } from "lib/api/match"
import { TypeProto } from "lib/api/proto"
import { LooseObject } from "lib/help"

import "./ProtoMatchmap.scss"
import { Proto } from "lib/api"
import { Alert } from "components/common"
import { PROTO_MSG } from "constants/messages"

interface Props {
  matchmapDataList: TypeMatchInfoInAHour[] | null
  targetProtoInfo: TypeProto | undefined
  getProtoGameInfo: Function
  closeDrawer: Function
  currentRound: number | undefined
  isVisible: boolean
}

type align = "left" | "center" | "right" | undefined
const center = "center" as align

const MatchmapPanel: FunctionComponent<Props> = ({
  isVisible,
  matchmapDataList,
  closeDrawer,
  targetProtoInfo,
  getProtoGameInfo,
  currentRound
}) => {
  const columns = [
    {
      title: "League",
      dataIndex: "league",
      key: "league"
    },
    {
      title: "Match Team",
      dataIndex: "matchTeam",
      key: "matchTeam",
      width: 200
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime"
    },
    {
      title: "Reversed [True]",
      dataIndex: "action_true",
      key: "action_true",
      align: center,
      // @ts-ignore: Unreachable code error
      render: (text: string | undefined, record: LooseObject) => {
        const title = `Are you sure to set Reversed=True on \n\n ${record.matchTeam}`
        return (
          <Popconfirm
            title={title}
            onConfirm={() => setMatchmapReversed(true, record.item)}
            okText="Yes"
            cancelText="No"
          >
            <Button type={"primary"}>True</Button>
          </Popconfirm>
        )
      }
    },
    {
      title: "Reversed [False]",
      dataIndex: "action_false",
      key: "action_false",
      align: center,
      // @ts-ignore: Unreachable code error
      render: (text: string | undefined, record: LooseObject) => {
        const title = `Are you sure to set Reversed=False on \n${record.matchTeam}`
        return (
          <Popconfirm
            title={title}
            placement="topRight"
            onConfirm={() => setMatchmapReversed(false, record.item)}
            okText="Yes"
            cancelText="No"
          >
            <Button type={"danger"}>False</Button>
          </Popconfirm>
        )
      }
    }
  ]

  const [tableDataSource, settableDataSource] = useState()

  useEffect(() => {
    settableDataSource(getTableDataSource())
  }, [matchmapDataList])

  const getTableDataSource = () => {
    if (matchmapDataList !== null) {
      return matchmapDataList.map(
        (item: TypeMatchInfoInAHour, index: number) => {
          return {
            key: index,
            league: item.league.abbreviation,
            matchTeam: `${item.matchTeam[0].teamInfo.name} vs ${item.matchTeam[1].teamInfo.name}`,
            startTime: item.start_time,
            item: item
          }
        }
      )
    } else {
      return []
    }
  }

  const setMatchmapReversed = (
    isReversed: boolean,
    matchmapData: TypeMatchInfoInAHour
  ) => {
    if (targetProtoInfo !== undefined) {
      Proto.insertProtoMatchMapData(
        targetProtoInfo.id,
        matchmapData.id,
        isReversed
      )
        .then(response => {
          if (response.status === 200) {
            Alert(
              PROTO_MSG.title_proto_matchmap,
              PROTO_MSG.matchmap_reserve_success
            )
            getProtoGameInfo(currentRound)
          }
        })
        .catch(e => {
          console.error(e)
        })
    }
  }

  return (
    <Drawer
      width={900}
      title="Match Map Game List"
      placement="right"
      closable={false}
      onClose={() => closeDrawer()}
      visible={isVisible}
    >
      <Table
        dataSource={tableDataSource}
        columns={columns}
        pagination={false}
      />
    </Drawer>
  )
}

export default MatchmapPanel
