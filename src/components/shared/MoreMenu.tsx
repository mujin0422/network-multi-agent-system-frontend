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
export function MoreMenu({ onView, onEdit, onCopy, actions = [] }: MoreMenuProps) {
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
      <DropdownMenuContent align="end" className="w-max min-w-36">
        {actions.map((action) => (
          <DropdownMenuItem
            className="whitespace-nowrap text-[13px]"
            key={action.id}
            onClick={action.onClick}
          >
            {action.icon}
            {action.label}
          </DropdownMenuItem>
        ))}
        {onView && (
          <DropdownMenuItem className="text-[13px]" onClick={onView}>
            <Eye />
            {t("common.details")}
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem className="text-[13px]" onClick={onEdit}>
            <Pencil />
            {t("common.edit")}
          </DropdownMenuItem>
        )}
        {onCopy && (
          <DropdownMenuItem className="text-[13px]" onClick={onCopy}>
            <Copy />
            {t("common.copyId")}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
