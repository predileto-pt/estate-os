import { MainWrapper } from "@/components/main-wrapper";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainWrapper>{children}</MainWrapper>;
}
