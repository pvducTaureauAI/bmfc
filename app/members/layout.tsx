import PublicLayout from "@/components/PublicLayout";

export default function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicLayout>{children}</PublicLayout>;
}
