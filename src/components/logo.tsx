import logoAsset from "@/assets/e-embassy-logo.svg.asset.json";

export function Logo({ className = "h-7" }: { className?: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-[var(--logo-surface)] px-2 py-1">
      <img src={logoAsset.url} alt="E-Embassy by Worldstreet" className={`w-auto ${className}`} />
    </span>
  );
}
