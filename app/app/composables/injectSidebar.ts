export function injectSidebar() {
  const sidebar = inject('sidebar') as {
    isSidebarOpen: Ref<boolean>
    openSidebar: () => void
    closeSidebar: () => void
  }

  if (!sidebar) {
    throw new Error('injectSidebar() must be used within a component that has access to the sidebar provider')
  }

  return sidebar
}
