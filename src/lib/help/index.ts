import { useState } from "react"
import { TypeLeagueWithNation } from "lib/api/league"
import { message } from "antd"

// Common
interface LooseObject {
  [key: string]: any
}

const filterObject = (obj: LooseObject, filter: string, filterValue: any) =>
  Object.keys(obj).reduce(
    (acc, val) =>
      obj[val][filter] === filterValue
        ? acc
        : {
            ...acc,
            [val]: obj[val]
          },
    {}
  )

const getCurrentDate = () => new Date().toISOString().slice(0, 10)

const useInput = (defaultValue: string) => {
  const [value, setValue] = useState(defaultValue)
  const onChange = (e: any) => {
    const {
      target: { value }
    } = e
    setValue(value)
  }
  return { value, onChange }
}

const copyText = (text: string) => {
  let tempField = document.createElement("textarea")
  tempField.innerText = text
  document.body.appendChild(tempField)
  tempField.select()
  document.execCommand("copy")
  tempField.remove()

  message.info("Text Copied", 1)
}

// Match Preview
const KOREAN_SPORTS_NAME: { [unit: string]: string } = {
  SOCCER: "축구",
  BASEBALL: "야구",
  BASKETBALL: "농구",
  VOLLEYBALL: "배구",
  UNKNOWN: "    "
}

const getOffsetTheDay = (
  dateTime: Date,
  offset?: number,
  isReturnObject?: boolean
) => {
  const targetDate = new Date(dateTime)
  offset = offset ? offset * -60 : targetDate.getTimezoneOffset()
  targetDate.setMinutes(targetDate.getMinutes() - offset)
  return isReturnObject ? targetDate.toString() : targetDate.toISOString()
}

const convertISOToDate = (date: string) =>
  date ? date.slice(0, 19).replace("T", " ") : date

const makeDescription = (match: LooseObject) => {
  let descrption = ` vs `

  match.matchTeam.map((item: LooseObject) => {
    descrption = `${item.type === "AWAY" ? descrption : ""}${item.teamInfo
      .name_kr || item.teamInfo.name}${item.type === "HOME" ? descrption : ""}`
  })

  return `[${KOREAN_SPORTS_NAME[match.sports]} : ${getOffsetTheDay(
    match.start_time
  ).slice(11, 16)}] ${descrption}`
}

// Team Mgmt
const parseLeagueAndNationList = (data: TypeLeagueWithNation[]) => {
  let parsedData: { [unit: string]: any } = {
    ALL: []
  }

  data.map(item => {
    const nation = item.n_name
    if (parsedData.hasOwnProperty(nation)) {
      parsedData[nation].push(item)
    } else {
      parsedData[nation] = [item]
    }

    parsedData["ALL"].push(item)
  })

  return parsedData
}

// Live Score
const getPeriodList = () => {
  let PERIOD_LIST: { [unit: string]: string[] } = {
    SOCCER: [
      "",
      "FIRST",
      "HALFTIME",
      "SECOND",
      "FULLTIME",
      "FIRST_EXTRA",
      "SECOND_EXTRA",
      "PENALTY"
    ],
    BASKETBALL: ["", "1Q", "2Q", "3Q", "4Q", "EQ"],
    BASEBALL: [""],
    VOLLEYBALL: ["", "1SET", "2SET", "3SET", "4SET", "5SET", "FINISH"],
    UNKNOWN: [""]
  }

  // make baseball period form
  Array.from(Array(30).keys()).map(i => {
    PERIOD_LIST.BASEBALL.push(`T${(i + 1) / 10 >= 1 ? "" : "0"}${i + 1}`)
    PERIOD_LIST.BASEBALL.push(`B${(i + 1) / 10 >= 1 ? "" : "0"}${i + 1}`)
  })

  return PERIOD_LIST
}

export {
  getCurrentDate,
  convertISOToDate,
  LooseObject,
  KOREAN_SPORTS_NAME,
  makeDescription,
  useInput,
  parseLeagueAndNationList,
  filterObject,
  getPeriodList,
  copyText,
  getOffsetTheDay
}
