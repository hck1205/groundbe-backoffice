import React, { useState, useEffect } from "react"
import { Table, Button, Input, Icon, Upload } from "antd"
import { LooseObject, copyText } from "lib/help"
import { THUMBNAIL_BASE_URL } from "constants/variables"

import "./LeagueMgmt.scss"

const { Search } = Input

interface Props {
  initData: LooseObject[] | null
  updateLeagueInfo: Function
  updateLeagueLogo: Function
  searchLeagues: Function
}

function LeagueMgmt({
  initData,
  updateLeagueInfo,
  updateLeagueLogo,
  searchLeagues
}: Props) {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id"
    },
    {
      title: "Nation",
      dataIndex: "nation",
      key: "nation"
    },
    {
      title: "Sports",
      dataIndex: "sports",
      key: "sports"
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      // @ts-ignore: Unreachable code error
      render: (text: string | undefined, item: LooseObject) => {
        return (
          <>
            <Button
              className="leaguename__copy__button"
              type="default"
              icon="copy"
              onClick={() => copyText(item.rawData.name)}
            />
            {item.rawData.name}
          </>
        )
      }
    },

    {
      title: "Name (KR)",
      dataIndex: "name_kr",
      key: "name_kr",
      // @ts-ignore: Unreachable code error
      render: (text: string | undefined, item: LooseObject) => {
        return (
          <Input
            key={`${item.id}_name_kr`}
            defaultValue={item.name_kr}
            onChange={e => (item.name_kr = e.target.value)}
          />
        )
      }
    },
    {
      title: "Abbreviation",
      dataIndex: "abbreviation",
      key: "abbreviation",
      // @ts-ignore: Unreachable code error
      render: (text: string | undefined, item: LooseObject) => {
        return (
          <Input
            key={`${item.id}_abbreviation`}
            defaultValue={item.abbreviation}
            onChange={e => (item.abbreviation = e.target.value)}
          />
        )
      }
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type"
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      // @ts-ignore: Unreachable code error
      render: (text: string | undefined, item: LooseObject) => {
        return (
          <span
            key={`${item.id}_confirm`}
            className="input__confirm"
            onClick={() => updateLeagueInfo(item)}
          >
            Update
          </span>
        )
      }
    },
    {
      title: "Logo",
      key: "logo",
      // @ts-ignore: Unreachable code error
      render: (text: string | undefined, item: LooseObject) => {
        const uploadButton = () => {
          return (
            <div>
              <Icon
                type={
                  uploadingKey === item.id && isUploading ? "loading" : "plus"
                }
              />
              <div className="ant-upload-text">Upload</div>
            </div>
          )
        }
        return (
          <Upload
            name="league-logo"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            accept=".jpg,.jpeg,.png"
            data={item}
            customRequest={uploadLogo}
          >
            {item.logo_path ? (
              <img
                src={`${THUMBNAIL_BASE_URL}${item.logo_path}`}
                alt="avatar"
                style={{ width: "100%" }}
              />
            ) : (
              uploadButton()
            )}
          </Upload>
        )
      }
    }
  ]

  const [dataTableSource, setTableDataSource] = useState<any[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadingKey, setUploadingKey] = useState(-1)

  useEffect(() => {
    const dataSource = getTableDataSource()
    if (dataSource !== null) setTableDataSource(dataSource)
    setUploadingKey(-1)
  }, [initData])

  const getTableDataSource = () => {
    if (initData !== null) {
      return initData.map((item: LooseObject, index: number) => {
        return {
          key: `${item.id}_${index}`,
          id: item.id,
          nation: item.n_name,
          sports: item.sports,
          name_kr: item.name_kr,
          abbreviation: item.abbreviation,
          type: item.type,
          logo_path: item.logo_path,
          rawData: item
        }
      })
    }
    return null
  }

  const uploadLogo = (info: LooseObject) => {
    setUploadingKey(info.data.id)
    setIsUploading(true)
    updateLeagueLogo(info)
  }

  return (
    <>
      <div className="search__box__container">
        <Search
          className="search__box"
          placeholder="Please type league names to search"
          onSearch={keyword => keyword && searchLeagues(keyword)}
          allowClear
          enterButton
        />
      </div>

      <Table
        dataSource={dataTableSource}
        columns={columns}
        pagination={{ pageSize: 20, position: "top" }}
      />
    </>
  )
}

export default LeagueMgmt
