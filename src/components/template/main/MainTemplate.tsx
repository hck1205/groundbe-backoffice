import React from "react"
import "./MainTemplate.scss"

interface Props {
  children?: React.ReactNode
  footer?: React.ReactNode
  header?: React.ReactNode
}

function PageTemplate({ header, children, footer = {} }: Props) {
  return (
    <div className="page-template">
      {header}
      <main>{children}</main>
      {footer}
    </div>
  )
}

export default PageTemplate
