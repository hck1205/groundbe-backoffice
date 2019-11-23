import React, { FunctionComponent, useState, useEffect } from "react"
import { InputNumber, Button, Table, Popconfirm, Drawer, message } from "antd"
import moment from "moment"

import { TypeProto, TypeProtoGameInfo } from "lib/api/proto"
import { Alert } from "components/common"
import { PROTO_MSG } from "constants/messages"
import { Proto } from "lib/api"
import { LooseObject } from "lib/help"
import { TypeMatchInfoInAHour } from "lib/api/match"

import MatchmapPanel from "./MatchmapPanel"

import "./ProtoMatchmap.scss"

interface Props {
  initData: TypeProtoGameInfo
  getProtoGameInfo: Function
  fetchMatchmap: Function
  matchmapDataList: TypeMatchInfoInAHour[] | null
  targetProtoInfo: TypeProto | undefined
}

function ProtoMatchmap({
  initData,
  getProtoGameInfo,
  fetchMatchmap,
  matchmapDataList,
  targetProtoInfo
}: Props) {
  const columns = [
    {
      title: "Seq",
      dataIndex: "seq",
      key: "seq"
    },
    {
      title: "Proto ID",
      dataIndex: "protoId",
      key: "protoId",
      width: 90
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description"
    },
    {
      title: "Start At",
      dataIndex: "startAt",
      key: "startAt"
    },
    {
      title: "Sports",
      dataIndex: "sports",
      key: "sports"
    },
    {
      title: "League",
      dataIndex: "league",
      key: "league",
      width: 100
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      // @ts-ignore: Unreachable code error
      render: (text: string | undefined, record: LooseObject) => {
        const hasMatchInfo = record.item.matchInfo !== null

        return hasMatchInfo ? (
          <Popconfirm
            title="Are you sure to delete this task?"
            onConfirm={() => deleteMatchmap(record.item)}
            okText="Yes"
            cancelText="No"
          >
            <Button type={"danger"} size="small">
              Delete
            </Button>
          </Popconfirm>
        ) : (
          <Button
            type={"primary"}
            size="small"
            onClick={() => fetchMatchmap(record.item)}
          >
            Register
          </Button>
        )
      }
    },
    {
      title: "Reversed",
      dataIndex: "reversed",
      key: "reversed"
    },
    {
      title: "Match ID",
      dataIndex: "matchId",
      key: "matchId",
      width: 90
    },
    {
      title: "Home Team",
      dataIndex: "homeTeam",
      key: "homeTeam",
      width: 90
    },
    {
      title: "Away Team",
      dataIndex: "awayTeam",
      key: "awayTeam",
      width: 90
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime"
    },
    {
      title: "League",
      dataIndex: "englishLeague",
      key: "englishLeague",
      width: 120
    },
    {
      title: "Season",
      dataIndex: "season",
      key: "season",
      width: 170
    }
  ]

  const [dataTableSource, setTableDataSource] = useState<any[]>([])
  const [protoList, setProtoList] = useState<TypeProto[]>([])
  const [currentRound, setCurrentRound] = useState<number | undefined>(0)
  const [drawer, setDrawer] = useState(false)

  useEffect(() => {
    initData.protos.length && setProtoList(initData.protos)
    initData.protos.length && setCurrentRound(parseInt(initData.round))
  }, [initData])

  useEffect(() => {
    setTableDataSource(getTableDataSource())
  }, [protoList])

  useEffect(() => {
    if (matchmapDataList !== null) setDrawer(true)
  }, [matchmapDataList])

  const closeDrawer = () => {
    setDrawer(false)
  }

  const getTableDataSource = () =>
    protoList.map((item: TypeProto, index) => {
      const hasMatchInfo = item.matchInfo !== null
      let reversed = ""

      if (hasMatchInfo) {
        if (isNaN(item.matchInfo.reversed)) {
          reversed = item.matchInfo.reversed
        } else if (item.matchInfo.reversed === 0) {
          reversed = ""
        } else {
          reversed = "Reversed"
        }
      }

      return {
        key: index + 1,
        seq: item.seq,
        protoId: item.id,
        description: item.description,
        startAt: moment(item.start_at).format("MM-DD HH:mm"),
        sports: item.sports,
        league: item.league,
        status: item.status,
        reversed: reversed,
        matchId: hasMatchInfo ? item.matchInfo.match_id : "",
        homeTeam: item.home_team,
        awayTeam: item.away_team,
        startTime: hasMatchInfo
          ? moment(item.matchInfo.match.start_time).format("MM-DD HH:mm")
          : "",
        englishLeague: hasMatchInfo ? item.matchInfo.match.league.name : "",
        season: hasMatchInfo ? item.matchInfo.match.season.name : "",
        item: item
      }
    })

  // Delete Matchmap
  const deleteMatchmap = (protoInfo: TypeProto) => {
    Proto.deleteProtoMatchmap(protoInfo.matchInfo.match_id)
      // @ts-ignore: Unreachable code error
      .then(response => {
        Alert(PROTO_MSG.title_proto_matchmap, PROTO_MSG.matchmap_delete_success)
        // Refresh Game List
        getProtoGameInfo(currentRound)
      })
      .catch(e => {
        Alert(PROTO_MSG.title_proto_matchmap, PROTO_MSG.matchmap_delete_fail)
        console.error(`[deleteProtoMatchmap ERROR]\n${e}`)
      })
  }

  return (
    <>
      <div className="proto__matchmap__header">
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

      <MatchmapPanel
        isVisible={drawer}
        closeDrawer={closeDrawer}
        matchmapDataList={matchmapDataList}
        targetProtoInfo={targetProtoInfo}
        getProtoGameInfo={getProtoGameInfo}
        currentRound={currentRound}
      />

      <Table
        dataSource={dataTableSource}
        columns={columns}
        pagination={false}
      />
    </>
  )
}

export default ProtoMatchmap
