// ** React Imports
import { ReactNode } from 'react'

// ** Types
import { NavLink } from 'src/@core/layouts/types'

interface Props {
  navLink?: NavLink
  children: ReactNode
}

const CanViewNavLink = (props: Props) => {
  // ** Props
  const { children, navLink } = props

  // Directly render children if `auth` is explicitly set to false
  // or render children without checking for ability.can
  if (navLink && navLink.auth === false) {
    return <>{children}</>
  } else {
    // Since ability and ability.can checks are removed,
    // this condition changes to always render if navLink is defined.
    return navLink ? <>{children}</> : null
  }
}

export default CanViewNavLink
