import client from "lib/client"
import { LooseObject } from "lib/help"

// proto
export interface TypeProtoGameInfo {
  code: string
  created_at: string
  id: string
  month: string
  name: string
  protos: Array<TypeProto>
  round: string
  start_at: string
  status: string
  type: string
  updated_at: string
  year: string
}

export interface TypeProto {
  away_score: string | null
  away_team: string
  created_at: string
  description: string
  home_score: string | null
  home_team: string
  id: string
  league: string
  matchInfo: LooseObject
  schedule_id: string
  seq: number
  sports: string
  stadium: string
  start_at: string
  status: string
  type: string
  updated_at: string
}

async function getProtoListWithMatchInfo() {
  return await client.get<TypeProtoGameInfo>("/protos/list/withMatchList")
}

async function deleteProtoMatchmap(protoId: number) {
  return await client.delete(`/protos/matchmap/${protoId}`, {})
}

async function getProtoListMatchInfoByRound(
  round: number | undefined,
  year: number
) {
  return await client.get(`/protos/list/withMatchList/${year}/${round}`, {})
}

async function getMatchListByTime(sportsType: string, time: number) {
  return await client.get(
    `/matchs/listinaHour?sports=${sportsType}&t=${time}`,
    {}
  )
}

async function insertProtoMatchMapData(
  proto_id: string,
  match_id: string,
  reversed: boolean
) {
  return client.post("/protos/matchmap", {
    data: { proto_id, match_id, reversed }
  })
}

// Proto score management Page
async function getProtoListWithComments(year?: number) {
  return client.get(`/protos/list/withComments${year ? `/${year}` : ""}`, {})
}

async function updateProtoScore(
  id: number,
  home_score: number | null,
  away_score: number | null
) {
  return client.post("/protos/score", {
    data: { id, home_score, away_score }
  })
}

async function getProtoCommentsListByRound(
  round: number | undefined,
  year: number
) {
  return client.get(`/protos/list/withComments/${year}/${round}`, {})
}

export default {
  getProtoListWithMatchInfo,
  deleteProtoMatchmap,
  getProtoListMatchInfoByRound,
  getMatchListByTime,
  insertProtoMatchMapData,
  getProtoListWithComments,
  updateProtoScore,
  getProtoCommentsListByRound
}
