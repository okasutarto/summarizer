
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

export function UrlDialog({
    imageUrl,
    onCloseDialog,
    isValidImageUrl,
    onInputImageUrl,
    onInserImageUrl
  }) {

  useEffect(() => {
    
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
              onChange={(e) => onInputImageUrl(e.target.value)}
            />
            <div className="flex justify-center">
                { 
                  (isValidImageUrl && imageUrl) && 
                  <div className="w-24 h-24 group">
                    <img
                      src={imageUrl}
                      className="w-full h-full object-cover rounded-md border-2 border-gray-200"
                    />
                  </div>
                }
                { 
                  (!isValidImageUrl && imageUrl) &&
                  <span className="text-sm">
                    <span type="button" className="text-base text-red-500 me-1 font-bold">
                      x
                    </span>
                    Invalid image URL
                  </span>
                }
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={onCloseDialog}>
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              disabled={!imageUrl || !isValidImageUrl}
              onClick={onInserImageUrl}
            >
              Insert
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
