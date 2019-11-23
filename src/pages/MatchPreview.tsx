import React from "react"
import { MainTemplate, Footer, Header } from "components"
import { MatchPreviewContainer } from "containers"

const PreviewMgmt = () => (
  <MainTemplate header={<Header />} footer={<Footer />}>
    <MatchPreviewContainer />
  </MainTemplate>
)

export default PreviewMgmt
