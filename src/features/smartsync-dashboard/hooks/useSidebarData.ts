import { useMemo } from 'react'

import { sidebarData as adminSidebarData } from '../helpers/sidebar-data-admin'
import type { SidebarData } from '../types/sidebar'

export function useSidebarData(): SidebarData {
	return useMemo(() => adminSidebarData, [])
}


