import React, { useState, useEffect } from "react"

import { ProtoScoreMgmt } from "components"
import { LoadingBar, Alert } from "components/common"
import { Proto } from "lib/api"
import { PROTO_MSG } from "constants/messages"
import { TypeProtoGameInfo } from "lib/api/proto"

function ProtoScoreMgmtContainer() {
  const [initData, setInitData] = useState<TypeProtoGameInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  // Fecth init Data
  const fetchData = () => {
    Proto.getProtoListWithComments()
      .then((response: any) => {
        setInitData(response.data)
        setLoading(false)
      })
      .catch(e => {
        console.error(`[getProtoListWithComments ERROR]\n${e}`)
        setError(true)
      })
  }

  const updateProtoScore = (
    id: number,
    homeScore: number | null,
    awayScore: number | null,
    currentRound?: number | undefined
  ) => {
    Proto.updateProtoScore(id, homeScore, awayScore)
      .then(response => {
        if (response.status === 200) {
          Alert(PROTO_MSG.title_proto_score, PROTO_MSG.score_update_success)
          const year = new Date().getFullYear()
          updateProtoGameInfo(currentRound, year)
        }
      })
      .catch(e => {
        console.error(`[updateProtoScore ERROR]\n${e}`)
        setError(true)
      })
  }

  const updateProtoGameInfo = (round: number | undefined, year: number) => {
    Proto.getProtoCommentsListByRound(round, year)
      .then(response => {
        setInitData(response.data[0])
      })
      .catch(e => {
        console.error(`[updateProtoGameInfo ERROR]\n${e}`)
        setError(true)
      })
  }

  return (
    <>
      {loading && <LoadingBar />}
      {error && <p style={{ textAlign: "center" }}>Error</p>}
      {initData && (
        <ProtoScoreMgmt
          initData={initData}
          updateProtoScore={updateProtoScore}
          updateProtoGameInfo={updateProtoGameInfo}
        />
      )}
    </>
  )
}

export default ProtoScoreMgmtContainer
