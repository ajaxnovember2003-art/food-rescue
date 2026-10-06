export interface NavItem {
  label: string;
  to: string;
  hint?: string;
}

export const primaryNav: NavItem[] = [
  { label: "Home", to: "/", hint: "The rescue story" },
  { label: "Rescue", to: "/rescue", hint: "Food waiting now" },
  { label: "How It Works", to: "/#how-it-works", hint: "Four steps" },
  { label: "Impact", to: "/impact", hint: "What rescues change" },
  { label: "Community", to: "/community", hint: "People in the network" },
];

export const workspaceNav: NavItem[] = [
  { label: "Donate food", to: "/donate", hint: "List surplus in a minute" },
  { label: "Volunteer", to: "/volunteer", hint: "Take a pickup" },
  { label: "Organization", to: "/organization", hint: "Kitchen workspace" },
];
