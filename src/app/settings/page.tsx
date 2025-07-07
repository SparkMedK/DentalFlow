import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight mb-4">Settings</h2>
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>
            This is a placeholder for your settings. You can manage your profile and preferences here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>User settings form will be available here in a future update.</p>
        </CardContent>
      </Card>
    </div>
  );
}
