import { Copy, Ellipsis, Eye, Pencil } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { MoreMenuProps } from "@/types/components"

/**
 * Menu thao tác nhanh cho một bản ghi.
 * Chỉ hiển thị những hành động đã được truyền callback tương ứng.
 */
export function MoreMenu({ onView, onEdit, onCopy }: MoreMenuProps) {
  const { t } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t("common.openMenu")}
          />
        }
      >
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {onView && (
          <DropdownMenuItem onClick={onView}>
            <Eye />
            {t("common.details")}
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Pencil />
            {t("common.edit")}
          </DropdownMenuItem>
        )}
        {onCopy && (
          <DropdownMenuItem onClick={onCopy}>
            <Copy />
            {t("common.copyId")}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
