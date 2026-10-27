import { Crown, ShieldCheck, UserRound, UserRoundPlus } from "lucide-react";

import { workspaceMembers } from "@/lib/mock-data";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { WorkspaceMember } from "@/types/settings/WorkspaceMember";

const ROLE_CONFIG: Record<
  WorkspaceMember["role"],
  {
    label: string;
    variant: "brand" | "ink" | "outline";
  }
> = {
  owner: {
    label: "Owner",
    variant: "brand",
  },
  admin: {
    label: "Admin",
    variant: "ink",
  },
  member: {
    label: "Member",
    variant: "outline",
  },
};

function getMemberInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export default function MembersSettings() {
  return (
    <section aria-labelledby="members-heading" className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">TEAM & ACCESS</p>

          <h2 id="members-heading" className="font-display text-2xl font-bold">
            Workspace members
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            View the people and roles in this demo workspace.
          </p>
        </div>

        <Button type="button" variant="brutal" size="sm" disabled>
          <UserRoundPlus size={15} />
          Invite member
        </Button>
      </div>

      <div className="panel">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
          <div>
            <h3 className="font-display text-lg font-bold">Team directory</h3>

            <p className="mt-1 text-xs text-muted-foreground">
              Members and assigned demo roles
            </p>
          </div>

          <Badge variant="outline">{workspaceMembers.length} members</Badge>
        </div>

        <ul className="divide-y divide-border">
          {workspaceMembers.map((member) => {
            const role = ROLE_CONFIG[member.role];

            return (
              <li
                key={member.id}
                className="flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary font-display text-sm font-bold">
                    {getMemberInitials(member.name)}
                  </div>

                  <div className="min-w-0">
                    <p className="wrap-break-word text-sm font-semibold">
                      {member.name}
                    </p>

                    <p className="mt-1 break-all text-xs text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:pl-14 lg:pl-0">
                  <Badge variant={role.variant}>
                    {member.role === "owner" && <Crown size={12} />}

                    {member.role === "admin" && <ShieldCheck size={12} />}

                    {member.role === "member" && <UserRound size={12} />}

                    {role.label}
                  </Badge>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled
                    aria-label={`Change role for ${member.name}`}
                  >
                    Change role
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled
                    aria-label={`Remove ${member.name}`}
                  >
                    Remove
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-lg border border-border bg-secondary/40 p-5">
        <h3 className="text-sm font-semibold">
          Access management is not enabled
        </h3>

        <p className="mt-2 text-xs leading-6 text-muted-foreground">
          Inviting members, changing roles, and removing access will be
          implemented with the ASP.NET Core backend. Permissions displayed here
          are illustrative and do not enforce authorization.
        </p>
      </div>
    </section>
  );
}
