import React from "react"
import { MainTemplate, Footer, Header } from "components"
import { ProtoScoreMgmtContainer } from "containers"

const ProtoScoreMgmt = () => (
  <MainTemplate header={<Header />} footer={<Footer />}>
    <ProtoScoreMgmtContainer />
  </MainTemplate>
)

export default ProtoScoreMgmt
