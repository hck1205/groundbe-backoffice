import client from "lib/client"

export interface TypeTeamInfo {
  abbreviation: string
  created_at: string
  id: number
  location: string | null
  logo_path: string | null
  name: string
  name_kr: string
  nickname: string | null
  updated_at: string
}

export interface TypeNation {
  id: string
  name: string
  created_at: string
  updated_at: string
}

async function getTeamListByLeagueId(leagueId: string) {
  return await client.get(`/team/league/${leagueId}`)
}

async function updateTeamNameKrAndAbbreviation(
  id: string,
  name_kr: string,
  abbreviation: string
) {
  return await client.post(`/team`, { id, name_kr, abbreviation })
}

async function updateTeamLogoImage(image: Blob, id: string) {
  const formData = new FormData()
  formData.append("image", image)
  formData.append("id", id)

  return client.post("/team/upload/logoImage", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
}

async function searchTeamList(
  keyword: string,
  searchFilter: "team" | "name_kr" | "league"
) {
  if (!keyword) return Promise.reject()
  return await client.get(
    `/team/search/name/${keyword}?filter=${searchFilter}`
  )
}

export default {
  getTeamListByLeagueId,
  updateTeamNameKrAndAbbreviation,
  updateTeamLogoImage,
  searchTeamList
}
