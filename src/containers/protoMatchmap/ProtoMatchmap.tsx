import React, { useState, useEffect } from "react"

import { Match, Proto } from "lib/api"
import { TypeProtoGameInfo, TypeProto } from "lib/api/proto"

import { ProtoMatchmap } from "components"
import { LoadingBar } from "components/common"
import { TypeMatchInfoInAHour } from "lib/api/match"

function ProtoMatchMapContainer() {
  const [initData, setInitData] = useState<TypeProtoGameInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [targetProtoInfo, setTargetProtoInfo] = useState<TypeProto>()
  const [matchmapDataList, setMatchmapDataList] = useState<
    TypeMatchInfoInAHour[] | null
  >(null)

  useEffect(() => {
    fetchData()
  }, [])

  // Fecth init Data
  const fetchData = () => {
    Proto.getProtoListWithMatchInfo()
      .then((response: any) => {
        setInitData(response.data)
        setLoading(false)
      })
      .catch(e => {
        console.error(`[getProtoListAtFirst ERROR]\n${e}`)
        setError(true)
      })
  }

  // Update Proto Game by Round
  const getProtoGameInfo = (round: number) => {
    setLoading(true)

    const year = new Date().getFullYear()
    Match.getProtoListMatchInfoByRound(round, year)
      .then((response: any) => {
        setInitData(response.data[0])
        setLoading(false)
      })
      .catch(e => {
        console.error(`[getProtoListAtFirst ERROR]\n${e}`)
        setError(true)
      })
  }

  const fetchMatchmap = async (protoInfo: TypeProto) => {
    const sportsType = protoInfo.sports
    const time = new Date(protoInfo.start_at).getTime()

    Proto.getMatchListByTime(sportsType, time)
      .then(response => {
        setTargetProtoInfo(protoInfo)
        setMatchmapDataList(response.data)
      })
      .catch(e => {
        console.error(`[fetchMatchmap ERROR]\n${e}`)
      })
  }

  return (
    <>
      {loading && <LoadingBar />}
      {error && <p style={{ textAlign: "center" }}>Error</p>}
      {initData && (
        <ProtoMatchmap
          initData={initData}
          getProtoGameInfo={getProtoGameInfo}
          fetchMatchmap={fetchMatchmap}
          matchmapDataList={matchmapDataList}
          targetProtoInfo={targetProtoInfo}
        />
      )}
    </>
  )
}

export default ProtoMatchMapContainer
