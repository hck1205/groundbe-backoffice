import React, { FunctionComponent } from "react"

interface Props {
  children: React.ReactNode
  className?: string
}

function Responsive({ children, className = "", ...rest }: Props) {
  return (
    <div className={`common responsive ${className}`} {...rest}>
      {children}
    </div>
  )
}

export default Responsive
