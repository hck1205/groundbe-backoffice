import client from "lib/client"

export interface TypeLeagueWithNation {
  abbreviation: string
  id: string
  logo_path: string | null
  n_created_at: string
  n_id: string
  n_name: string
  n_updated_at: string
  name: string
  name_kr: string
  sports: string
  type: string
}

async function getAllLeagueAndNationPureJoin() {
  return await client.get("/league/all")
}

async function updateLeagueKrNameAndAbbreviation(
  id: number,
  name_kr: string,
  abbreviation: string
) {
  return client.post("/league", { id, name_kr, abbreviation })
}

async function updateLeagueLogoImage(image: Blob, id: string) {
  const formData = new FormData()
  formData.append("image", image)
  formData.append("id", id)
  return client.post("/league/upload/logoImage", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
}

async function getSearchLeagueList(keyword: string) {
  return await client.get(`/league/search/${keyword}`)
}

export default {
  getAllLeagueAndNationPureJoin,
  updateLeagueKrNameAndAbbreviation,
  updateLeagueLogoImage,
  getSearchLeagueList
}
