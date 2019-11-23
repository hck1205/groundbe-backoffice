import React, { useState, useEffect } from "react"

import { LoadingBar, Alert } from "components/common"
import { LEAGUE_MSG } from "constants/messages"
import { LeagueMgmt } from "components"

import { LooseObject } from "lib/help"
import { League } from "lib/api"

function LeagueMgmtContainer() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [initData, setInitData] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    League.getAllLeagueAndNationPureJoin()
      .then(response => {
        setLoading(false)
        setInitData(response.data)
      })
      .catch(e => {
        console.error(`[LeagueMgmtfetchData ERROR]\n${e}`)
        setError(true)
      })
  }

  const updateLeagueInfo = (leagueInfo: LooseObject) => {
    setLoading(true)
    const { id, name_kr, abbreviation } = leagueInfo

    League.updateLeagueKrNameAndAbbreviation(id, name_kr, abbreviation)
      .then(response => {
        setLoading(false)
        if (response.status === 200) {
          Alert(
            LEAGUE_MSG.title_league_update,
            LEAGUE_MSG.league_info_update_success
          )
        }
      })
      .catch(e => {
        console.error(`[updateLeagueInfo ERROR]\n${e}`)
        setError(true)
      })
  }

  const updateLeagueLogo = (info: LooseObject) => {
    League.updateLeagueLogoImage(info.file, info.data.id)
      .then(response => {
        if (response.status === 200) {
          Alert(
            LEAGUE_MSG.title_league_update,
            LEAGUE_MSG.league_logo_update_success
          )
        }
      })
      .catch(e => {
        console.error(`[updateLeagueLogo ERROR]\n${e}`)
        setError(true)
      })
  }

  const searchLeagues = (keyword: string) => {
    if (keyword) {
      League.getSearchLeagueList(keyword)
        .then(response => {
          const sortedList = response.data.sort(
            (a: LooseObject, b: LooseObject) =>
              a.name > b.name ? 1 : a.name < b.name ? -1 : 0
          )
          setInitData(sortedList)
        })
        .catch(e => {
          console.error(`[searchLeagues ERROR]\n${e}`)
          setError(true)
        })
    }
  }

  return (
    <>
      {loading && <LoadingBar />}
      {error && <p style={{ textAlign: "center" }}>Error</p>}
      {initData && (
        <LeagueMgmt
          initData={initData}
          updateLeagueInfo={updateLeagueInfo}
          updateLeagueLogo={updateLeagueLogo}
          searchLeagues={searchLeagues}
        />
      )}
    </>
  )
}

export default LeagueMgmtContainer
