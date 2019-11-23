import React from "react"
import { useHistory } from "react-router-dom"

import { Card, Col, Row } from "antd"

import "./Main.scss"

function Main() {
  const history = useHistory()

  const colSpan = 6

  return (
    <div className="main__container">
      <Row gutter={16}>
        <Col span={colSpan}>
          <Card
            className="card"
            title="Match Preview Management"
            onClick={() => {
              history.push("/match-preview")
            }}
          >
            Users can find match previews and statistics of number of match
            previews
          </Card>
        </Col>

        <Col span={colSpan}>
          <Card
            className="card"
            title="League Management"
            onClick={() => {
              history.push("/league-mgmt")
            }}
          >
            Users can find league information and update information such as,
            name abbreviation and logo
          </Card>
        </Col>

        <Col span={colSpan}>
          <Card
            className="card"
            title="Team Management"
            onClick={() => {
              history.push("/team-mgmt")
            }}
          >
            Users can find team information by selecting nationality and
            leagues, and information such as, team name abbreviation and logo
            can be updated.
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={colSpan}>
          <Card
            className="card"
            title="Proto Matchmap Management"
            onClick={() => {
              history.push("/proto-matchmap")
            }}
          >
            Users can find proto match information and find sports match to map
            with proto match
          </Card>
        </Col>
        <Col span={colSpan}>
          <Card
            className="card"
            title="Proto Score Management"
            onClick={() => {
              history.push("/proto-score")
            }}
          >
            User can find proto information and update proto match scores
          </Card>
        </Col>
        <Col span={colSpan}>
          <Card
            className="card"
            title="User Management"
            onClick={() => {
              history.push("/user-mgmt")
            }}
          >
            Users can find registerd users and update users' permission as well
            as profiles
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={colSpan}>
          <Card
            className="card"
            title="Live Score Management"
            onClick={() => {
              history.push("/match-livescore")
            }}
          >
            Users can check and update live scores, However, users only can
            update matches that has "Done" status.
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Main
