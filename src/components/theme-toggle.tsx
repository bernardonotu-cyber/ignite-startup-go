import { MoonStar, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isGold = theme === "gold";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggle}
      aria-label={isGold ? "Switch to light theme" : "Switch to black & gold theme"}
      title={isGold ? "Switch to light theme" : "Switch to black & gold theme"}
      className={`press rounded-full ${className}`}
    >
      {isGold ? <Sun className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
    </Button>
  );
}
