import { createBrowserRouter } from "react-router-dom"

import MainLayout from "@/components/layout/MainLayout"
import NotFound from "@/app/not-found"
import Login from "@/features/auth/page"
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute"
import AccessControl from "@/features/roles/page"
import AuditLogs from "@/features/audit-logs/page"
import Chat from "@/features/chatbot/page"
import Credentials from "@/features/credentials/page"
import Dashboard from "@/features/dashboard/page"
import DeviceCatalog from "@/features/device-catalog/page"
import Devices from "@/features/devices/page"
import Profile from "@/features/profile/page"
import SystemSettings from "@/features/settings/page"
import Tasks from "@/features/tasks/page"
import Users from "@/features/users/page"

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "chat", element: <Chat /> },
          { path: "tasks", element: <Tasks /> },
          { path: "devices", element: <Devices /> },
          { path: "credentials", element: <Credentials /> },
          { path: "device-catalog", element: <DeviceCatalog /> },
          { path: "audit-logs", element: <AuditLogs /> },
          { path: "users", element: <Users /> },
          { path: "access-control", element: <AccessControl /> },
          { path: "settings/system", element: <SystemSettings /> },
          { path: "profile", element: <Profile /> },
          { path: "*", element: <NotFound /> },
        ],
      },
    ],
  },
])
