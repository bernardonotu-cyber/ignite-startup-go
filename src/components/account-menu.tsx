import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  User, LogOut, FileText, Briefcase, Radar, Compass, Plus, ShieldCheck, LayoutDashboard, BookUser, CloudSun,
} from "lucide-react";

export function AccountMenu() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!active || !user) return;
      setEmail(user.email ?? null);
      setName((user.user_metadata?.full_name as string) ?? null);
      setAvatar((user.user_metadata?.avatar_url as string) ?? null);

      const [{ data: profile }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("full_name, avatar_url").eq("id", user.id).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", user.id),
      ]);
      if (!active) return;
      if (profile?.full_name) setName(profile.full_name);
      if (profile?.avatar_url) setAvatar(profile.avatar_url);
      setIsAdmin((roles ?? []).some((r) => r.role === "admin"));
    })();
    return () => { active = false; };
  }, []);

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const initials = (name ?? email ?? "?").slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="press rounded-full" aria-label="Account menu">
          <Avatar className="h-8 w-8">
            {avatar ? <AvatarImage src={avatar} alt={name ?? "Profile"} /> : null}
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="truncate">
          <span className="block font-medium">{name ?? "Traveler"}</span>
          <span className="block truncate text-xs font-normal text-muted-foreground">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><Link to="/profile"><User className="mr-2 h-4 w-4" /> Profile</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/trips/new"><Plus className="mr-2 h-4 w-4" /> Plan a trip</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/documents"><FileText className="mr-2 h-4 w-4" /> My documents</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/passport-visa"><BookUser className="mr-2 h-4 w-4" /> Passport & visa</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/track"><Radar className="mr-2 h-4 w-4" /> Track application</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/hire"><Briefcase className="mr-2 h-4 w-4" /> Hire a pro</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/explore"><Compass className="mr-2 h-4 w-4" /> Explore</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/weather" search={{ q: "" }}><CloudSun className="mr-2 h-4 w-4" /> Weather</Link></DropdownMenuItem>
        {isAdmin ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/admin/documents"><ShieldCheck className="mr-2 h-4 w-4" /> Admin dashboard</Link>
            </DropdownMenuItem>
          </>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
