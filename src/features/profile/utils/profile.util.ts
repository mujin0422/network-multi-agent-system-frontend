export function profileInitials(fullName: string) {
  return fullName.trim().split(/\s+/).slice(-2).map((part) => part[0]).join("").toUpperCase()
}
