export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-9999 backdrop-blur-sm">
      <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
