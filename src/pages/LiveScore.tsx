import React from "react"
import { MainTemplate, Footer, Header } from "components"
import { LiveScoreContainer } from "containers"

const LiveScore = () => (
  <MainTemplate header={<Header />} footer={<Footer />}>
    <LiveScoreContainer />
  </MainTemplate>
)

export default LiveScore
