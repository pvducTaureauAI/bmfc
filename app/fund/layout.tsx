import PublicLayout from "@/components/PublicLayout";

export default function FundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicLayout>{children}</PublicLayout>;
}
