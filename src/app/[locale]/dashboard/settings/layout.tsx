import { SettingsSidebar } from "./components/settings-sidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-3">
        <SettingsSidebar />
      </div>
      <div className="col-span-6">{children}</div>
      <div className="col-span-3" />
    </div>
  );
}
