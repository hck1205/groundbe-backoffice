import React, { useEffect, useState } from "react"
import { Select } from "antd"

import { MatchPreview } from "components"
import { LoadingBar } from "components/common"

import { Match } from "lib/api"
import { TypeMatchPreviewInfo } from "lib/api/match"
import { getCurrentDate, LooseObject } from "lib/help"

const { Option } = Select

function MatchPreviewContainer() {
  const [initData, setInitData] = useState<TypeMatchPreviewInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchData(getCurrentDate())
  }, [])

  const fetchData = (date: string) => {
    Match.getMatchPreviewList(date)
      .then(response => {
        setInitData(response)
        setLoading(false)
      })
      .catch(e => {
        console.error(`[getMatchPreviewList ERROR]\n${e}`)
        setError(true)
      })
  }

  const updateDataByDate = (date: string) => fetchData(date)

  // Return Option tag for user Select
  const getUserSelectList = () => {
    if (initData) {
      let { matchPreviewList, userList } = initData
      return userList
        .filter((userInfo: LooseObject) => {
          const list = matchPreviewList.filter(
            (matchPreview: LooseObject) =>
              userInfo.id.toString() === matchPreview.user_id
          )
          return list.length > 0
        })
        .map((userInfo: LooseObject, index: number) => (
          <Option key={`${userInfo.email}_${index}`} value={userInfo.id}>
            {userInfo.email}
          </Option>
        ))
    } else {
      return <></>
    }
  }

  return (
    <>
      {loading && <LoadingBar />}
      {error && <p style={{ textAlign: "center" }}>Error</p>}
      {initData && (
        <MatchPreview
          initData={initData}
          userListAsOptionTag={getUserSelectList()}
          updateDataByDate={updateDataByDate}
        />
      )}
    </>
  )
}

export default MatchPreviewContainer
