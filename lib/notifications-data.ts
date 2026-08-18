export type NotificationCategory = "action" | "info";

export interface NotificationAction {
  label: string;
  style: "primary" | "secondary";
}

export interface Notification {
  id: string;
  category: NotificationCategory;
  icon: string;
  iconBg: string;
  actor?: string;
  text: string;
  meta: string;
  href: string;
  read: boolean;
  actions?: NotificationAction[];
}

export function getNotifications(): Notification[] {
  return [
    {
      id: "n1",
      category: "action",
      icon: "\u26a1",
      iconBg: "bg-amber-100",
      actor: "Sarah Park",
      text: "Sarah Park invited you to join Autonomous Drone Navigation as ML / CV Engineer.",
      meta: "12 min ago \u00b7 Stanford",
      href: "/projects/autonomous-drone-navigation",
      read: false,
      actions: [
        { label: "Accept", style: "primary" },
        { label: "Decline", style: "secondary" },
      ],
    },
    {
      id: "n2",
      category: "action",
      icon: "\ud83e\udd1d",
      iconBg: "bg-blue-100",
      actor: "Alex Liu",
      text: "Alex Liu wants to connect. \u201cSaw your robot arm project \u2014 would love to chat about embedded robotics.\u201d",
      meta: "4 hours ago \u00b7 Berkeley EE",
      href: "/u/alex-liu",
      read: false,
      actions: [
        { label: "Accept", style: "primary" },
        { label: "Ignore", style: "secondary" },
      ],
    },
    {
      id: "n3",
      category: "info",
      icon: "\ud83d\udcac",
      iconBg: "bg-violet-100",
      actor: "Dr. Catherine Mwangi",
      text: "Dr. Catherine Mwangi commented on your methodology document: \u201cGreat progress \u2014 let\u2019s discuss the dataset balancing strategy Friday.\u201d",
      meta: "1 hour ago \u00b7 AI Recycling Sorter",
      href: "/workspace/ai-recycling-sorter/files",
      read: false,
    },
    {
      id: "n4",
      category: "info",
      icon: "\u2713",
      iconBg: "bg-emerald-100",
      actor: "Priya Raman",
      text: "Priya Raman completed \u201cTrain v1 classifier on TrashNet.\u201d Result: 87% validation accuracy.",
      meta: "2 hours ago \u00b7 AI Recycling Sorter",
      href: "/workspace/ai-recycling-sorter/tasks",
      read: true,
    },
    {
      id: "n5",
      category: "info",
      icon: "\ud83c\udfaf",
      iconBg: "bg-rose-100",
      text: "3 new high-match projects this week. Top match: Autonomous Drone Navigation (94%).",
      meta: "Yesterday \u00b7 Weekly digest",
      href: "/explore",
      read: true,
    },
    {
      id: "n6",
      category: "info",
      icon: "\ud83c\udfc6",
      iconBg: "bg-cyan-100",
      actor: "Maya Johnson",
      text: "Maya Johnson endorsed you for Computer Vision. You now have 5 endorsements for this skill.",
      meta: "Yesterday \u00b7 Howard ME",
      href: "/u/jmoonga",
      read: true,
    },
    {
      id: "n7",
      category: "info",
      icon: "\ud83d\udd14",
      iconBg: "bg-neutral-200",
      text: "Friday check-in with Dr. Mwangi is in 2 days. Review your methodology doc beforehand.",
      meta: "Yesterday \u00b7 Reminder",
      href: "/workspace/ai-recycling-sorter/overview",
      read: true,
    },
    {
      id: "n8",
      category: "info",
      icon: "\ud83d\udcf0",
      iconBg: "bg-pink-100",
      text: "New paper from Dr. Catherine Mwangi\u2019s lab: \u201cCompliant Manipulation in Cluttered Environments.\u201d",
      meta: "3 days ago \u00b7 IROS 2025",
      href: "/mentors/catherine-mwangi",
      read: true,
    },
    {
      id: "n9",
      category: "info",
      icon: "\u2699\ufe0f",
      iconBg: "bg-indigo-100",
      text: "Linked v1.4 is live. New: bulk task imports, calendar sync, improved AI Research Assistant context.",
      meta: "5 days ago \u00b7 Product update",
      href: "/changelog",
      read: true,
    },
  ];
}
