import { NoteSidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { UserNav } from "@/components/user-nav"
import Link from "next/link"

export default function Home() {
  return (
    <SidebarProvider>
      <NoteSidebar />
      <SidebarInset>
        <header className="sticky top-0 flex h-16 items-center justify-between border-b bg-background px-4">
          <div className="flex items-center">
            <SidebarTrigger />
            <h1 className="ml-4 text-xl font-semibold">My Notes</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/notes/new">
              <Button>
                <span className="mr-1">+</span> New Note
              </Button>
            </Link>
            <UserNav />
          </div>
        </header>
        <main className="flex-1 p-6">
          <div className="grid gap-6">
            {/* Note content would go here */}
            <div className="h-64 rounded-lg border border-dashed p-4 text-center flex items-center justify-center">
              <p className="text-muted-foreground">Select a note or create a new one</p>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
