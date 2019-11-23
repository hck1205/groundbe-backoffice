import React from "react"
import { MainTemplate, Footer, Header } from "components"
import { UserMgmtContainer } from "containers"

const UserMgmtPage = () => (
  <MainTemplate header={<Header />} footer={<Footer />}>
    <UserMgmtContainer />
  </MainTemplate>
)

export default UserMgmtPage
