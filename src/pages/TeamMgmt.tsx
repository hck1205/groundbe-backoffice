import React from "react"
import { MainTemplate, Footer, Header } from "components"
import { TeamMgmtContainer } from "containers"

const TeamMgmt = () => (
  <MainTemplate header={<Header />} footer={<Footer />}>
    <TeamMgmtContainer />
  </MainTemplate>
)

export default TeamMgmt
