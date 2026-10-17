import { Pencil, Save, X } from "lucide-react"
import { useState, type FormEvent } from "react"
import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
} from "@/components/shared/PageLayout"
import { Button } from "@/components/ui/button"
import { PROFILE_COPY } from "../constants/profile.constants"
import { useProfileData } from "../hooks/use-profile-data"
import { ProfileInformationForm } from "./ProfileInformationForm"
import { ProfileSummaryCard } from "./ProfileSummaryCard"

/** Điều phối dữ liệu và chế độ chỉnh sửa cho các component hồ sơ. */
export function ProfileDetails() {
  const { profile, role, session, mode, setMode, saveProfile } =
    useProfileData()
  const [fullName, setFullName] = useState(profile.full_name)
  const [email, setEmail] = useState(profile.email)
  const isEditing = mode === "edit"

  function cancelEdit() {
    setFullName(profile.full_name)
    setEmail(profile.email)
    setMode("view")
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    saveProfile({ full_name: fullName.trim(), email: email.trim() })
  }

  const headerAction = isEditing ? (
    <div className="flex gap-2">
      <Button type="button" variant="outline" size="sm" onClick={cancelEdit}>
        <X />
        Cancel
      </Button>
      <Button type="submit" size="sm" form="profile-form">
        <Save />
        Save changes
      </Button>
    </div>
  ) : (
    <Button size="sm" onClick={() => setMode("edit")}>
      <Pencil />
      Edit profile
    </Button>
  )

  return (
    <PageLayout>
      <PageLayoutHeader
        title={PROFILE_COPY.title}
        description={PROFILE_COPY.description}
      >
        {headerAction}
      </PageLayoutHeader>
      <PageLayoutContent className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <ProfileSummaryCard profile={profile} roleName={role.name} />
        <ProfileInformationForm
          profile={profile}
          roleName={role.name}
          session={session}
          fullName={fullName}
          email={email}
          editing={isEditing}
          onFullNameChange={setFullName}
          onEmailChange={setEmail}
          onSubmit={submit}
        />
      </PageLayoutContent>
    </PageLayout>
  )
}
