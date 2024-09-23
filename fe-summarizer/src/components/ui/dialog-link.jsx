import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function DialogLink() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="material-icons-outlined">
          link
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Input
              id="link"
              placeholder="https://"
              readOnly
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
