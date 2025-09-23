export type SidebarData = {
  user: {
    name: string
    email: string
    avatar: string
  }
  teams: Array<{
    name: string
    logo: any
    plan: string
  }>
  navGroups: Array<{
    title: string
    items: Array<{
      title: string
      url?: string
      icon: any
      badge?: string
      items?: Array<{
        title: string
        url: string
        icon?: any
      }>
    }>
  }>
}
