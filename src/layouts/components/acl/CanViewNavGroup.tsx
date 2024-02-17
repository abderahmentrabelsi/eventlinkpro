// ** React Imports
import { ReactNode } from 'react'

// ** Types
import { NavGroup } from 'src/@core/layouts/types'

interface Props {
  navGroup?: NavGroup
  children: ReactNode
}

const CanViewNavGroup = (props: Props) => {
  // ** Props
  const { children, navGroup } = props

  const checkForVisibleChild = (arr: NavGroup[]): boolean => {
    return arr.some((i: NavGroup) => {
      if (i.children) {
        return checkForVisibleChild(i.children)
      } else {
        // Assuming every item should be visible if no specific checks are required
        return true
      }
    })
  }

  const canViewMenuGroup = (item: NavGroup) => {
    const hasAnyVisibleChild = item.children && checkForVisibleChild(item.children)

    // If there are no action and subject properties, rely on child visibility
    return hasAnyVisibleChild
  }

  // Directly render children if `auth` is explicitly set to false or if the group can be viewed
  if (navGroup && navGroup.auth === false) {
    return <>{children}</>
  } else {
    return navGroup && canViewMenuGroup(navGroup) ? <>{children}</> : null
  }
}

export default CanViewNavGroup
