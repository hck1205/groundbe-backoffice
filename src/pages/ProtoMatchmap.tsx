import React from "react"
import { MainTemplate, Footer, Header } from "components"
import { ProtoMatchmapContainer } from "containers"

const ProtoMatchmap = () => (
  <MainTemplate header={<Header />} footer={<Footer />}>
    <ProtoMatchmapContainer />
  </MainTemplate>
)

export default ProtoMatchmap
