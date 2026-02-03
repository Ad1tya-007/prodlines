'use client';

import { RepositorySyncForm } from './repository-sync-form';
import { NotificationsForm } from './notifications-form';
import { DangerZone } from './danger-zone';

export function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and settings
        </p>
      </div>
      <div className="space-y-2">
        <RepositorySyncForm />
        <NotificationsForm />
        <DangerZone />
      </div>
    </div>
  );
}
