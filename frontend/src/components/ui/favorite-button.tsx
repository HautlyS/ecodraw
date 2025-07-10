import * as React from "react"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface FavoriteButtonProps {
  id: string
  className?: string
  size?: "sm" | "default" | "lg"
}

const FavoriteButton = React.forwardRef<
  HTMLButtonElement,
  FavoriteButtonProps
>(({ id, className, size = "sm", ...props }, ref) => {
  const { favorites, addToFavorites, removeFromFavorites, isFavorite } = useSidebar()
  const favorite = isFavorite(id)

  const handleToggle = () => {
    if (favorite) {
      removeFromFavorites(id)
    } else {
      addToFavorites(id)
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          ref={ref}
          variant="ghost"
          size={size}
          onClick={handleToggle}
          className={cn(
            "h-6 w-6 p-0 hover:bg-accent/10 transition-all duration-200",
            favorite && "text-red-500 hover:text-red-600",
            !favorite && "text-muted-foreground hover:text-foreground",
            className
          )}
          {...props}
        >
          <Heart 
            className={cn(
              "h-3.5 w-3.5 transition-all duration-200",
              favorite && "fill-current scale-110",
              !favorite && "scale-100"
            )} 
          />
          <span className="sr-only">
            {favorite ? "Remove from favorites" : "Add to favorites"}
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>{favorite ? "Remove from favorites" : "Add to favorites"}</p>
      </TooltipContent>
    </Tooltip>
  )
})
FavoriteButton.displayName = "FavoriteButton"

export { FavoriteButton }
