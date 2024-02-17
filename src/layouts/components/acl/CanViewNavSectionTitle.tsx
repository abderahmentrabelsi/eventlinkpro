// ** React Imports
import { ReactNode } from 'react'

// ** Types
import { NavSectionTitle } from 'src/@core/layouts/types'

interface Props {
  children: ReactNode
  navTitle?: NavSectionTitle
}

const CanViewNavSectionTitle = (props: Props) => {
  // ** Props
  const { children, navTitle } = props

  // Directly render children if `auth` is explicitly set to false
  // or if navTitle is defined, assuming permission checks are not needed
  if (navTitle && navTitle.auth === false) {
    return <>{children}</>
  } else {
    // Since we're not using ability checks anymore,
    // render the children if navTitle is defined,
    // ignoring the action and subject properties.
    return navTitle ? <>{children}</> : null
  }
}

export default CanViewNavSectionTitle
