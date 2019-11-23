import client from "lib/client"
import { LooseObject } from "lib/help"

async function getLiveScoreDataList(
  date: string,
  sports: string,
  status: string
) {
  const timezone = new Date().getTimezoneOffset()
  return await client.get(
    `/livescore?date=${date}&sports=${sports}&status=${status}&timezone=${timezone}`,
    {}
  )
}

async function updateLiveScore(data: LooseObject) {
  const { id, home_score, away_score, status, period } = data

  return await client.post(`/livescore`, {
    id,
    home_score,
    away_score,
    status,
    period,
    source_type: "MANUAL"
  })
}

export default {
  getLiveScoreDataList,
  updateLiveScore
}
