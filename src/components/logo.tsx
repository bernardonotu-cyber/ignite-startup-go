import logoAsset from "@/assets/logo.png.asset.json";

export function Logo({ className = "h-6 w-6" }: { className?: string }) {
  return <img src={logoAsset.url} alt="BUBOLI" className={className} />;
}
