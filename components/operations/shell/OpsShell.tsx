import OpsSidebar from "@/components/operations/shell/OpsSidebar";

export default function OpsShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white flex">
      <OpsSidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">{children}</div>
    </div>
  );
}
