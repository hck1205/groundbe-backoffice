import React, { useState, useEffect } from "react"
import moment from "moment"

import { Score } from "lib/api"

import { SCORE_MSG } from "constants/messages"
import { Alert } from "components/common"
import LiveScore from "components/live_score"
import { LoadingBar } from "components/common"
import { LooseObject } from "lib/help"

function LiveScoreContainer() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [initData, setInitData] = useState(null)

  useEffect(() => {
    const today = moment().format("YYYY-MM-DD")
    setLiveScoreDataList(today, "ALL", "ALL")
  }, [])

  const setLiveScoreDataList = (
    date: string,
    sports: string,
    status: string
  ) => {
    setLoading(true)
    Score.getLiveScoreDataList(date, sports, status)
      .then(response => {
        setInitData(response.data)
        setLoading(false)
      })
      .catch(e => {
        console.error(`[setLiveScoreDataList ERROR]\n${e}`)
        setError(true)
      })
  }

  const updateLiveScore = (data: LooseObject) => {
    Score.updateLiveScore(data)
      .then(response => {
        if (response.status === 200) {
          Alert(
            SCORE_MSG.title_live_score_update,
            SCORE_MSG.live_score_update_success
          )
        }
      })
      .catch(e => {
        console.error(`[updateLiveScore ERROR]\n${e}`)
        setError(true)
      })
  }

  return (
    <>
      {loading && <LoadingBar />}
      {error && <p style={{ textAlign: "center" }}>Error</p>}
      {initData && (
        <LiveScore
          initData={initData}
          setLiveScoreDataList={setLiveScoreDataList}
          updateLiveScore={updateLiveScore}
        />
      )}
    </>
  )
}

export default LiveScoreContainer
