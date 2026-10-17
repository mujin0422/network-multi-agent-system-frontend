import type { ComponentProps, ReactNode } from "react"

export type PageLayoutProps = ComponentProps<"section">

export type PageLayoutHeaderProps = Omit<ComponentProps<"header">, "title"> & {
  title: string
  description?: string
}

export type PageLayoutContentProps = ComponentProps<"div">

export type PageLayoutOverviewProps = ComponentProps<"section">

export type PageLayoutStatProps = Omit<ComponentProps<"div">, "children"> & {
  label: string
  value: ReactNode
  description?: string
  icon?: ReactNode
  iconClassName?: string
}
