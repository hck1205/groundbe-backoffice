import React, { useState, useEffect } from "react"

import { LoadingBar } from "components/common"
import { Team, League } from "lib/api"
import { parseLeagueAndNationList, LooseObject } from "lib/help"

import { TeamMgmt } from "components"
import { Alert } from "components/common"
import { TEAM_MSG } from "constants/messages"

function TeamMgmtContainer() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [nationList, setNationList] = useState({})
  const [teamList, setTeamList] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    League.getAllLeagueAndNationPureJoin()
      .then(response => {
        setLoading(false)
        const parsedData = parseLeagueAndNationList(response.data)
        setNationList(parsedData)
      })
      .catch(e => {
        console.error(`[getAllLeagueAndNationList ERROR]\n${e}`)
        setError(true)
      })
  }

  const getTeamListByLeagueId = (leagueId: string) => {
    setLoading(true)
    Team.getTeamListByLeagueId(leagueId)
      .then(response => {
        setLoading(false)
        setTeamList(response.data)
      })
      .catch(e => {
        console.error(`[getTeamListByLeagueId ERROR]\n${e}`)
        setError(true)
      })
  }

  const updateTeamInfo = (teamInfo: LooseObject) => {
    setLoading(true)
    const { id, name_kr, abbreviation } = teamInfo

    Team.updateTeamNameKrAndAbbreviation(id, name_kr, abbreviation)
      .then(response => {
        setLoading(false)
        if (response.status === 200) {
          Alert(TEAM_MSG.title_team_update, TEAM_MSG.team_info_update_success)
        }
      })
      .catch(e => {
        console.error(`[updateTeamNameKrAndAbbreviation ERROR]\n${e}`)
        setError(true)
      })
  }

  const updateTeamLogoImage = (info: LooseObject) => {
    Team.updateTeamLogoImage(info.file, info.data.id)
      .then(response => {
        if (response.status === 200) {
          Alert(TEAM_MSG.title_team_update, TEAM_MSG.team_logo_update_success)
          getTeamListByLeagueId(info.data.rawData.league_id)
          setLoading(false)
        }
      })
      .catch(e => {
        console.error(`[updateTeamLogoImage ERROR]\n${e}`)
        setError(true)
      })
  }

  const searchTeamList = (
    keyword: string,
    searchFilter: "team" | "name_kr" | "league"
  ) => {
    Team.searchTeamList(keyword, searchFilter)
      .then(response => {
        if (response.status === 200) {
          setTeamList(response.data)
          setLoading(false)
        }
      })
      .catch(e => {
        console.error(`[updateTeamLogoImage ERROR]\n${e}`)
        setError(true)
      })
  }

  return (
    <>
      {loading && <LoadingBar />}
      {error && <p style={{ textAlign: "center" }}>Error</p>}
      {nationList && (
        <TeamMgmt
          nationList={nationList}
          teamList={teamList}
          updateTeamList={getTeamListByLeagueId}
          updateTeamInfo={updateTeamInfo}
          updateTeamLogoImage={updateTeamLogoImage}
          searchTeamList={searchTeamList}
        />
      )}
    </>
  )
}

export default TeamMgmtContainer
