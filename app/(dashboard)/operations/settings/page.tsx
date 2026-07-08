import type { Metadata } from "next";
import {
  DataRow,
  ModuleContainer,
  ModuleHeader,
  SectionPanel,
  StatusPill,
} from "@/components/operations/ModuleUI";
import {
  catPreferences,
  settingsOrganization,
  settingsPermissions,
  settingsUsers,
} from "@/components/operations/module-mock-data";

export const metadata: Metadata = {
  title: "Settings | AI Operations Center",
  robots: { index: false, follow: false },
};

export default function SettingsPage() {
  return (
    <ModuleContainer>
      <ModuleHeader
        eyebrow="Settings"
        title="Organization & Preferences"
        description="Manage organization details, users, permissions, and CAT (Command & Action Terminal) preferences."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionPanel title="Organization" subtitle={settingsOrganization.name}>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between rounded-lg border border-white/10 bg-black/30 px-3 py-2.5">
              <dt className="text-silver">Workspace</dt>
              <dd className="font-medium text-white">{settingsOrganization.workspace}</dd>
            </div>
            <div className="flex justify-between rounded-lg border border-white/10 bg-black/30 px-3 py-2.5">
              <dt className="text-silver">Timezone</dt>
              <dd className="font-medium text-white">{settingsOrganization.timezone}</dd>
            </div>
            <div className="flex justify-between rounded-lg border border-white/10 bg-black/30 px-3 py-2.5">
              <dt className="text-silver">Plan</dt>
              <dd className="font-medium text-white">{settingsOrganization.plan}</dd>
            </div>
          </dl>
        </SectionPanel>

        <SectionPanel title="Users" subtitle="Team access">
          <div className="space-y-2">
            {settingsUsers.map((user) => (
              <DataRow
                key={user.id}
                primary={user.name}
                secondary={user.email}
                status={user.role}
                statusVariant={user.role === "Owner" ? "danger" : user.role === "Admin" ? "info" : "neutral"}
              />
            ))}
          </div>
        </SectionPanel>

        <SectionPanel title="Permissions" subtitle="Role-based access">
          <div className="space-y-2">
            {settingsPermissions.map((perm) => (
              <DataRow
                key={perm.id}
                primary={perm.area}
                status={perm.access}
                statusVariant={perm.access === "Restricted" ? "warning" : "success"}
              />
            ))}
          </div>
        </SectionPanel>

        <SectionPanel title="CAT Preferences" subtitle="Command & Action Terminal">
          <ul className="space-y-2">
            {catPreferences.map((pref) => (
              <li
                key={pref.id}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-black/30 px-3 py-2.5"
              >
                <span className="text-sm text-silver">{pref.label}</span>
                <StatusPill
                  status={pref.enabled ? "On" : "Off"}
                  variant={pref.enabled ? "success" : "neutral"}
                />
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-stone">
            CAT integration with NEO is not yet connected. Preferences are mock UI only.
          </p>
        </SectionPanel>
      </div>
    </ModuleContainer>
  );
}
