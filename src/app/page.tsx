import { MobileNav, Nav } from '@/components/nav'
import { UserInfo } from '@/components/user-info'
import { SearchCommand } from '@/components/search-command'
import { AppBreadcrumb } from '@/components/app-breadcrumb'
import { HeroBanner } from '@/components/hero-banner'

export default function Home() {
  return (
    <div className="p-3 sm:p-5 min-h-dvh grid items-center pb-20 lg:pb-0">
      <div className="grid grid-cols-1 lg:grid-cols-[.5fr_1fr] p-3 sm:p-5 gap-10">
        <div className="hidden lg:block">
          <Nav />
        </div>
        <div className="space-y-4 min-h-[200px] lg:min-h-[40vh]">
          <div className="space-y-10">
            <div className="flex items-center justify-end">
              <UserInfo />
            </div>
            <div className="flex items-center justify-between">
              <AppBreadcrumb />
              <SearchCommand />
            </div>
          </div>
          <HeroBanner />
          <div className="grid grid-cols-2 gap-4 p-2">
            <div>
              <p></p>
            </div>
            <div>
              <p></p>
            </div>
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  )
}
