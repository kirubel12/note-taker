"use client"
import { Book, Home, Plus, Search, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export function NoteSidebar() {
  return (
    <div className="h-screen w-60 border-r bg-background p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <Book className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-medium">Notes</h1>
      </div>
      
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search..." className="pl-8 bg-muted/40 border-none" />
      </div>
      
      {/* Navigation */}
      <nav className="space-y-1 mb-6">
        <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/50 text-sm font-medium">
          <Home className="h-4 w-4" />
          <span>All Notes</span>
        </Link>
        <Link href="/favorites" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/50 text-sm font-medium">
          <Star className="h-4 w-4" />
          <span>Favorites</span>
        </Link>
      </nav>
      
      {/* Spacer */}
     
    </div>
  )
}
