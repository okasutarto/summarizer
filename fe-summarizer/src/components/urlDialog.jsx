
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"

export function UrlDialog({imageUrl, setImageUrl}) {
  useEffect(() => {
    console.log(imageUrl)
  }, [])

  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex items-center justify-center text-sm gap-2 cursor-pointer hover:bg-accent p-2">
          <span className="material-icons-outlined">
            link 
          </span>
          <p>Link to image</p>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Insert image from url</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Input
              id="link"
              // defaultValue="https://ui.shadcn.com/docs/installation"
              value={imageUrl}
              placeholder="Image url"
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              disabled={!imageUrl}
            >
              Insert
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
