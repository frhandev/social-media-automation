"use client";

import { useState } from "react";
import { Info } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Page } from "@/components/shared";
import { Badge } from "@/components/ui/badge";

import { user, workspace } from "@/lib/mock-data";

import SettingsNavigation, { type SettingsSection } from "./SettingsNavigation";

import ProfileSettings from "./ProfileSettings";
import WorkspaceSettings from "./WorkspaceSettings";
import MembersSettings from "./MembersSettings";
import PreferencesSettings from "./PreferencesSettings";

const SECTION_LABELS: Record<SettingsSection, string> = {
  profile: "Profile",
  workspace: "Workspace",
  members: "Members",
  preferences: "Preferences",
};

export default function SettingsPage() {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("profile");

  // Profile form draft — local React State only
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);

  // Workspace form draft — local React State only
  const [workspaceName, setWorkspaceName] = useState(workspace.name);

  function resetProfile() {
    setFullName(user.fullName);
    setEmail(user.email);
  }

  function resetWorkspace() {
    setWorkspaceName(workspace.name);
  }

  return (
    <Page className="space-y-8">
      <PageHeader
        eyebrow="Workspace management"
        title="Settings"
        description="Manage your profile, workspace, team members, and preferences."
        action={<Badge variant="outline">Frontend preview</Badge>}
      />

      {/* Frontend-only notice */}
      <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/40 p-4">
        <Info
          size={18}
          className="mt-0.5 shrink-0 text-brand-2"
          aria-hidden="true"
        />

        <div>
          <p className="text-sm font-semibold">Settings preview</p>

          <p className="mt-1 text-xs leading-6 text-muted-foreground">
            These settings use mock data. Form edits are kept temporarily in
            this page only. No changes are saved or applied to your account,
            workspace, or permissions.
          </p>
        </div>
      </div>

      {/* Settings navigation + active section */}
      <div className="settings-layout min-w-0">
        <SettingsNavigation value={activeSection} onChange={setActiveSection} />

        <div
          id="settings-content"
          role="region"
          aria-label={`${SECTION_LABELS[activeSection]} settings`}
          className="min-w-0"
        >
          {activeSection === "profile" && (
            <ProfileSettings
              fullName={fullName}
              email={email}
              onFullNameChange={setFullName}
              onEmailChange={setEmail}
              onReset={resetProfile}
            />
          )}

          {activeSection === "workspace" && (
            <WorkspaceSettings
              name={workspaceName}
              onNameChange={setWorkspaceName}
              onReset={resetWorkspace}
            />
          )}

          {activeSection === "members" && <MembersSettings />}

          {activeSection === "preferences" && <PreferencesSettings />}
        </div>
      </div>

      <div className="border-t border-border pt-5 text-xs text-subtle">
        SocialFlow AI · Settings preview · Backend integration required for
        persistent changes.
      </div>
    </Page>
  );
}
