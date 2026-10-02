import { createBrowserRouter } from "react-router-dom"

import MainLayout from "@/components/layout/MainLayout"
import AccessControl from "@/features/access-control/page"
import AuditLogs from "@/features/audit-logs/page"
import Chat from "@/features/chatbot/page"
import Credentials from "@/features/credentials/page"
import Dashboard from "@/features/dashboard/page"
import Devices from "@/features/devices/page"
import Network from "@/features/network/page"
import NotFound from "@/features/not-found/page"
import Profile from "@/features/profile/page"
import SystemSettings from "@/features/system-settings/page"
import Tasks from "@/features/tasks/page"
import Users from "@/features/users/page"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "chat", element: <Chat /> },
      { path: "tasks", element: <Tasks /> },
      { path: "network", element: <Network /> },
      { path: "devices", element: <Devices /> },
      { path: "credentials", element: <Credentials /> },
      { path: "audit-logs", element: <AuditLogs /> },
      { path: "users", element: <Users /> },
      { path: "access-control", element: <AccessControl /> },
      { path: "settings/system", element: <SystemSettings /> },
      { path: "profile", element: <Profile /> },
      { path: "*", element: <NotFound /> },
    ],
  },
])
