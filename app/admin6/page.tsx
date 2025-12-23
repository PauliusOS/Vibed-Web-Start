import { Admin6Sidebar } from "@/components/admin6"
import { PlusIcon } from "lucide-react"

export default function Admin6Page() {
  return (
    <Admin6Sidebar>
      <div className="space-y-8">
        {/* Quick Start Section */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-white">Quick Start</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-6 py-4 text-left transition-colors hover:border-zinc-700 hover:bg-zinc-800/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800">
                <PlusIcon className="h-5 w-5 text-zinc-400" />
              </div>
              <span className="font-medium text-white">Text to Video</span>
            </button>
          </div>
        </section>

        {/* All Projects Section */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-white">All Projects</h2>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-8">
            <p className="text-center text-zinc-500">No projects yet. Create your first project to get started.</p>
          </div>
        </section>
      </div>
    </Admin6Sidebar>
  )
}
