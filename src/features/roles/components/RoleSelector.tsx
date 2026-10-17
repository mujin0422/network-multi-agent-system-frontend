import { Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Role } from "../types/role.type"

export function RoleSelector({
  roles,
  activeRoleId,
  onSelect,
}: {
  roles: Role[]
  activeRoleId: string
  onSelect: (id: string) => void
}) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b py-4">
        <CardTitle className="text-sm">Roles</CardTitle>
        <p className="text-[10px] text-muted-foreground">
          Select a role to configure
        </p>
      </CardHeader>
      <CardContent className="space-y-1 p-2">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => onSelect(role.id)}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors",
              role.id === activeRoleId
                ? "bg-blue-500/10 text-blue-300"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            <div>
              <p className="text-xs font-medium">{role.name}</p>
              <p className="mt-0.5 font-mono text-[9px] opacity-60">
                {role.id}
              </p>
            </div>
            {role.id === activeRoleId && <Check className="size-3.5" />}
          </button>
        ))}
      </CardContent>
    </Card>
  )
}
