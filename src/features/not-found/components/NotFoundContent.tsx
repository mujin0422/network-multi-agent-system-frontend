import { Button } from "@/components/ui/button"
import { NOT_FOUND_COPY } from "../constants"
import { useNotFoundNavigation } from "../hooks/useNotFoundNavigation"

/** Trang fallback cho route không tồn tại, kèm các lựa chọn điều hướng an toàn. */
export function NotFoundContent() {
  const { goHome } = useNotFoundNavigation()
  return (
    <div className="grid min-h-[70vh] place-items-center text-center">
      <div>
        <p className="text-6xl font-semibold text-muted">
          {NOT_FOUND_COPY.code}
        </p>
        <h1 className="mt-4 text-xl font-semibold">{NOT_FOUND_COPY.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {NOT_FOUND_COPY.description}
        </p>
        <Button className="mt-5" onClick={goHome}>
          {NOT_FOUND_COPY.action}
        </Button>
      </div>
    </div>
  )
}
