import React from "react"
import { MainTemplate, Footer, Header } from "components"
import { MainContainer } from "containers"

const MainPage = () => (
  <MainTemplate header={<Header />} footer={<Footer />}>
    <MainContainer />
  </MainTemplate>
)

export default MainPage
