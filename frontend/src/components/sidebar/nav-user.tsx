import { BadgeCheck, ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLogout } from "@/hooks/use-auth";
import LoadingOverlay from "../shared/page-loader/loading-overlay";
import { getInitials } from "@/utils/getInitials";
import { useNavigate } from "react-router-dom";
import ThemeButtonMode from "../shared/theme-toggle";

export function NavUser({ user }: { user: User }) {
  const navigate = useNavigate();
  const { name, email, avatar, role } = user?.user ?? {
    name: "",
    email: "",
    avatar: "",
    role: "",
  };

  const initials = getInitials(name, email);
  const { mutate: logout, isLoading } = useLogout();
  const { isMobile } = useSidebar();

  if (isLoading) return <LoadingOverlay />;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-sidebar-primary hover:text-white data-[state=open]:bg-sidebar-primary dark:data-[state=open]:bg-sidebar data-[state=open]:text-sidebar-accent-foreground dark:hover:bg-muted/100 dark:data-[state=open]:text-white dark:text-white"
            >
              <Avatar className="h-8 w-8 rounded-lg ">
                <AvatarImage src={avatar} alt={name || email} />
                <AvatarFallback className="rounded-lg dark:bg-sidebar-primary dark:text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{name}</span>
                <span className="truncate text-xs">{email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            {/* Avatar */}
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={avatar} alt={name || email} />
                  <AvatarFallback className="rounded-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{name}</span>
                  <span className="truncate text-xs">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            {/* Account */}
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  if (role == "SUPER_ADMIN") {
                    navigate("/admin/settings");
                  } else if (role == "TEACHER") {
                    navigate("/teacher/settings");
                  } else if (!role) {
                    navigate("/");
                  }
                }}
              >
                <BadgeCheck />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            {/* Theme toggle */}
            <div className="flex items-center justify-between gap-2 py-0.5 px-3">
              <span className="text-sm ">Theme</span>
              <ThemeButtonMode />
            </div>
            <DropdownMenuSeparator />
            {/* Logout button */}
            <DropdownMenuItem
              onClick={() => logout()}
              className="cursor-pointer"
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
