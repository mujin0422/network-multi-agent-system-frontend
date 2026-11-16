import { createBrowserRouter } from "react-router-dom"

import { ProtectedRoute } from "@/app/guards/ProtectedRoute"
import AuthLayout from "@/app/layouts/AuthLayout"
import MainLayout from "@/app/layouts/MainLayout"
import AccessControlPage from "./app/AccessControlPage"
import AuditLogsPage from "./app/AuditLogsPage"
import BenchmarkRunsPage from "./app/BenchmarkRunsPage"
import BenchmarksPage from "./app/BenchmarksPage"
import ChatPage from "./app/ChatPage"
import CredentialsPage from "./app/CredentialsPage"
import DashboardPage from "./app/DashboardPage"
import DeviceCatalogPage from "./app/DeviceCatalogPage"
import DevicesPage from "./app/DevicesPage"
import EvaluationsPage from "./app/EvaluationsPage"
import ProfilePage from "./app/ProfilePage"
import SystemSettingsPage from "./app/SystemSettingsPage"
import TasksPage from "./app/TasksPage"
import UsersPage from "./app/UsersPage"
import LoginPage from "./auth/LoginPage"
import NotFoundPage from "./NotFoundPage"

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [{ path: "/login", element: <LoginPage /> }],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "chat", element: <ChatPage /> },
          { path: "tasks", element: <TasksPage /> },
          { path: "devices", element: <DevicesPage /> },
          { path: "credentials", element: <CredentialsPage /> },
          { path: "device-catalog", element: <DeviceCatalogPage /> },
          { path: "audit-logs", element: <AuditLogsPage /> },
          { path: "benchmarks", element: <BenchmarksPage /> },
          { path: "benchmark-runs", element: <BenchmarkRunsPage /> },
          { path: "evaluations", element: <EvaluationsPage /> },
          { path: "users", element: <UsersPage /> },
          { path: "access-control", element: <AccessControlPage /> },
          { path: "settings/system", element: <SystemSettingsPage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
