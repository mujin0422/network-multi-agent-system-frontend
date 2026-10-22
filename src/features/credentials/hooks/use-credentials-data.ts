import { useCallback, useEffect, useMemo, useState } from "react"
import { credentialsApi, devicesApi, usersApi } from "@/service"
import type { CredentialCreate, CredentialUpdate, User } from "@/service"
import type { Credential } from "../types/credentials.type"

export function useCredentialsData() {
  const [rows, setRows] = useState<Credential[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const reload = useCallback(async () => {
    try {
      const [credentials, devices, userRows] = await Promise.all([
        credentialsApi.list(), devicesApi.list({ page_size: 100 }), usersApi.list().catch(() => []),
      ])
      setRows(credentials.map((credential) => ({ ...credential, device_count: devices.items.filter((device) => device.credential_id === credential.id).length })))
      setUsers(userRows)
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Không thể tải credential") }
    finally { setLoading(false) }
  }, [])
  // eslint-disable-next-line react-hooks/set-state-in-effect -- đồng bộ state với API khi mount.
  useEffect(() => { void reload() }, [reload])
  const createCredential = useCallback(async (payload: CredentialCreate) => { await credentialsApi.create(payload); await reload() }, [reload])
  const updateCredential = useCallback(async (id: string, payload: CredentialUpdate) => { await credentialsApi.update(id, payload); await reload() }, [reload])
  function auditUserName(id: string | null) { return id ? users.find((user) => user.id === id)?.full_name ?? id : "—" }
  const summary = useMemo(() => ({
    total: rows.length,
    assigned: rows.filter((credential) => credential.device_count > 0).length,
    deviceAssignments: rows.reduce((total, credential) => total + credential.device_count, 0),
    unassigned: rows.filter((credential) => credential.device_count === 0).length,
  }), [rows])
  return { rows, summary, auditUserName, loading, error, reload, createCredential, updateCredential }
}
