import { Outlet } from "react-router-dom"

/** Khung tối giản cho các route xác thực công khai. */
export default function AuthLayout() {
  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden bg-background px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--success),transparent_28%),radial-gradient(circle_at_bottom_right,var(--ring),transparent_25%)] opacity-10" />
      <div className="relative w-full max-w-sm">
        <Outlet />
      </div>
    </main>
  )
}
