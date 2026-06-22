"use client";

import { useState } from "react"; // Use native state instead
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bars,
  Bell,
  Envelope,
  Gear,
  House,
  Magnifier,
  Person,
} from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react"; // Removed useDisclosure from here

const navItems = [
  { icon: House, label: "Home", href: "/dashboard" },
  { icon: Magnifier, label: "Search", href: "/dashboard/search" },
  { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
  { icon: Envelope, label: "Messages", href: "/dashboard/messages" },
  { icon: Person, label: "Profile", href: "/dashboard/profile" },
  { icon: Gear, label: "Settings", href: "/dashboard/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  // Safe, native React fallback for managing open state
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile / compact: HeroUI Drawer trigger */}
      <div className="md:hidden p-4">
        <Button variant="secondary" onPress={() => setIsOpen(true)}>
          <Bars />
          Menu
        </Button>

        {/* Controlled layout using standard props */}
        <Drawer
          isOpen={isOpen}
          onOpenChange={(open) => setIsOpen(open)}
          placement="left"
        >
          <Drawer.Backdrop />
          <Drawer.Content>
            <Drawer.Dialog>
              <Drawer.CloseTrigger />
              <Drawer.Header>
                <Drawer.Heading>Navigation</Drawer.Heading>
              </Drawer.Header>
              <Drawer.Body>
                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/dashboard" &&
                        pathname?.startsWith(item.href));
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsOpen(false)} // Closes drawer immediately on link click
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                          isActive
                            ? "bg-[#E2F0E7] text-[#2D6A4F] font-semibold"
                            : "text-foreground hover:bg-default"
                        }`}
                      >
                        <item.icon className="size-5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer>
      </div>

      {/* Desktop: persistent icon+label rail */}
      <nav
        aria-label="Primary"
        className="hidden md:flex flex-col gap-1 sticky top-5 self-start w-48 shrink-0"
      >
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-[#E2F0E7] text-[#2D6A4F] font-semibold"
                  : "text-foreground hover:bg-default"
              }`}
            >
              <item.icon className="size-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
