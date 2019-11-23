import React, { FunctionComponent } from "react"
import { MainTemplate, Footer, Header } from "components"
import { LeagueMgmtContainer } from "containers"

const LeagueMgmt: FunctionComponent = () => (
  <MainTemplate header={<Header />} footer={<Footer />}>
    <LeagueMgmtContainer />
  </MainTemplate>
)

export default LeagueMgmt
