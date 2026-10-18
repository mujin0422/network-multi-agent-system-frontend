import { useNavigate } from "react-router-dom"

import { PageLayout, PageLayoutContent } from "@/components/shared/PageLayout"
import { Button } from "@/components/ui/button"

/** Trang fallback cho route không tồn tại. */
export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <PageLayout className="min-h-[70vh]">
      <PageLayoutContent className="grid flex-1 place-items-center text-center">
        <div>
          <p className="text-6xl font-semibold text-muted">404</p>
          <h1 className="mt-4 text-xl font-semibold">Page not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The requested page does not exist.
          </p>
          <Button className="mt-5" onClick={() => navigate("/")}>
            Back to dashboard
          </Button>
        </div>
      </PageLayoutContent>
    </PageLayout>
  )
}
