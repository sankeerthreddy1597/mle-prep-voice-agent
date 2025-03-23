import { UserButton } from "@clerk/nextjs"
import { Presentation } from "lucide-react"

export const NavBar = ({user}: {user: any}) => {
    return (
        <div className="h-[80] flex items-center justify-between border-b-2 p-2 w-screen">
        <div className="flex flex-row gap-2 items-center">
          <Presentation className="h-10 w-10 text-green-800" />
          <h2 className="font-bold text-l">
            MLE Prep<span className="text-green-800">Wise</span>
          </h2>
        </div>
        <div className="flex flex-row items-center gap-2 mr-4">
          <h3 className="font-semibold">{user.firstName}</h3>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>
    )
}