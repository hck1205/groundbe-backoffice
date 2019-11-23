import React, { useEffect, useState } from "react"
import moment from "moment"
import { Drawer, Button, Radio, Table, DatePicker } from "antd"
import { RadioChangeEvent } from "antd/lib/radio"

import { LooseObject } from "lib/help"
import { Match } from "lib/api"

import "./MatchPreview.scss"

const { MonthPicker, WeekPicker } = DatePicker

function Statistics() {
  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email"
    },
    {
      title: "Permission",
      dataIndex: "permission",
      key: "permission"
    },
    {
      title: "Preview",
      dataIndex: "preview",
      key: "preview"
    },
    {
      title: "Translation",
      dataIndex: "translation",
      key: "Translation"
    }
  ]

  const [drawer, setDrawer] = useState(false)
  const [userList, setUserList] = useState<LooseObject | null>(null)
  const [filterType, setFilterType] = useState(2) // 0: Weekly, 1: Monthly, 2: Total
  const [dateFilterStart, setDateFilterStart] = useState(0)
  const [dateFilterEnd, setDateFilterEnd] = useState(0)
  const [dataTableSource, setTableDataSource] = useState<any[] | undefined>([])

  useEffect(() => {
    Match.getCountMatchPreviewByUser()
      .then(res => {
        const userList = res.data.userList
        setUserList(userList)
      })
      .catch(e => {
        console.error(e)
      })
  }, [])

  useEffect(() => {
    userList && setTableDataSource(getTableDataSource())
  }, [userList, dateFilterStart, dateFilterEnd])

  const getTableDataSource = () => {
    if (userList) {
      return Object.keys(userList).map((key: string) => {
        const target = userList[key]
        const previews = target.previews.filter((preview: LooseObject) => {
          if (filterType === 2) return true
          const createdTime = new Date(preview.created_at).getTime()
          return dateFilterStart < createdTime && dateFilterEnd >= createdTime
        })

        return {
          key: key,
          email: target.email,
          permission: target.permission,
          preview: previews.filter((p: LooseObject) => p.original_id === "-1")
            .length,
          translation: previews.filter(
            (p: LooseObject) => p.original_id !== "-1"
          ).length
        }
      })
    } else {
      return undefined
    }
  }

  const filterCountByDate = (e: RadioChangeEvent) => {
    setFilterType(e.target.value)
    // If Radio Value is not Total
    if (e.target.value !== 2) {
      const year = moment().year()
      const month = moment().month() + 1
      const weekNumber = moment().week()

      if (e.target.value === 0) {
        // FilterByWeek
        updateCountDataByWeekly(null, year + "-" + weekNumber)
      } else if (e.target.value === 1) {
        // FilterByMonth
        updateCountDataByMonthly(null, year + "-" + month)
      }
    } else {
      setDateFilterStart(Date.now())
      setDateFilterEnd(Date.now())
    }
  }

  const updateCountDataByWeekly = (
    // @ts-ignore: Unreachable code error
    date: moment.Moment | null,
    dateString: string
  ) => {
    let [year, numberOfWeek] = dateString.split("-")
    numberOfWeek = numberOfWeek.replace(/\D/g, "") // get numbers only ex) 43th -> 43

    // Start date of 'n'th week
    const startDateTimeOfWeek = moment()
      .year(parseInt(year))
      .week(parseInt(numberOfWeek))

    const milliSec = moment(startDateTimeOfWeek).valueOf()
    const startDate = milliSec - 1000 * 60 * 60 * 24
    const endDate = milliSec + 1000 * 60 * 60 * 24 * 6

    setDateFilterStart(startDate)
    setDateFilterEnd(endDate)
  }

  const updateCountDataByMonthly = (
    // @ts-ignore: Unreachable code error
    date: moment.Moment | null,
    dateString: string
  ) => {
    const startTime = new Date(dateString)
    setDateFilterStart(startTime.getTime())
    startTime.setMonth(startTime.getMonth() + 1)
    setDateFilterEnd(startTime.getTime())
  }

  return (
    <>
      <Button
        className="button--statistics"
        type="default"
        onClick={() => setDrawer(true)}
      >
        Stats
      </Button>
      <Drawer
        width={700}
        title="Match Preview Statistics"
        placement="right"
        closable={false}
        onClose={() => setDrawer(false)}
        visible={drawer}
      >
        <div className={"radio__button__container"}>
          <Radio.Group value={filterType} onChange={filterCountByDate}>
            <Radio.Button value={0}>Weekly</Radio.Button>
            <Radio.Button value={1}>Monthly</Radio.Button>
            <Radio.Button value={2}>Total</Radio.Button>
          </Radio.Group>

          {filterType === 0 ? (
            <WeekPicker
              className={"week__month__picker_container"}
              onChange={updateCountDataByWeekly}
              defaultValue={moment()}
            />
          ) : (
            <></>
          )}

          {filterType === 1 ? (
            <MonthPicker
              className={"week__month__picker_container"}
              onChange={updateCountDataByMonthly}
              defaultValue={moment()}
            />
          ) : (
            <></>
          )}
        </div>

        <Table
          columns={columns}
          dataSource={dataTableSource}
          pagination={false}
        />
      </Drawer>
    </>
  )
}

export default Statistics
