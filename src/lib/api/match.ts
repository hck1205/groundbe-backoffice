import client from "lib/client"
import { LooseObject } from "lib/help"

// MatchPreview
export interface TypeMatchPreviewInfo {
  languages: Array<string>
  matchPreviewList: Array<TypeMatchPreview>
  userList: Array<Object>
}

export interface TypeMatchPreview {
  id: string
  user_id: number
  match_id: string
  proto_id: string | null
  home_comment: string
  away_comment: string
  common_comment: string | null
  home_score: number
  home_score_extra: number | null
  away_score: number
  away_score_extra: number | null
  status: string
}

export interface TypeMatchInfo {
  seq: string
  id: string
  description: string
  start_at: string
  sports: string
  league: string
  matchInfo: LooseObject
}

export interface TypeMatchInfoInAHour {
  away_score: number
  created_at: string
  home_score: number
  id: string
  league: LooseObject
  matchTeam: LooseObject[]
  result: string
  season: LooseObject
  sports: string
  start_time: string
  status: string
  updated_at: string
}

async function getMatchPreviewList(date: string) {
  const timezone = new Date().getTimezoneOffset()
  const response = await client.get<TypeMatchPreviewInfo>(
    `/matchs/preview/withTranslate/date?date=${date}&timezone=${timezone}`
  )

  return response.data
}

async function postMatchPreview(payload: LooseObject) {
  return await client.post("/matchs/preview", { ...payload })
}

async function getCountMatchPreviewByUser() {
  return await client.get("/matchs/preview/count/user")
}

async function getProtoListMatchInfoByRound(
  round: number | undefined,
  year: number
) {
  return await client.get(`/protos/list/withMatchList/${year}/${round}`, {})
}

export default {
  getMatchPreviewList,
  postMatchPreview,
  getCountMatchPreviewByUser,
  getProtoListMatchInfoByRound
}
