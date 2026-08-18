"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Notification, NotificationCategory } from "@/lib/notifications-data";

type Filter = "all" | NotificationCategory;

export function NotificationsClient({ initial }: { initial: Notification[] }) {
  const [notifications, setNotifications] = useState<Notification[]>(initial);
  const [filter, setFilter] = useState<Filter>("all");
  const [respondedIds, setRespondedIds] = useState<Record<string, "accepted" | "declined">>({});

  const counts = useMemo(
    () => ({
      all: notifications.length,
      action: notifications.filter((n) => n.category === "action").length,
      info: notifications.filter((n) => n.category === "info").length,
    }),
    [notifications]
  );

  const visible = notifications.filter((n) => filter === "all" || n.category === filter);
  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAsRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function dismiss(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  function respond(id: string, choice: "accepted" | "declined") {
    setRespondedIds((prev) => ({ ...prev, [id]: choice }));
    markAsRead(id);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-normal text-black">Notifications</h1>
          <p className="text-xs text-black/50">
            {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
          </p>
        </div>
        <button
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className="text-[11px] font-semibold text-black disabled:text-black/30 hover:underline"
        >
          Mark all as read
        </button>
      </div>

      <div className="flex gap-2">
        <FilterTab label="All" count={counts.all} active={filter === "all"} onClick={() => setFilter("all")} />
        <FilterTab
          label="Action Required"
          count={counts.action}
          active={filter === "action"}
          onClick={() => setFilter("action")}
        />
        <FilterTab label="Info" count={counts.info} active={filter === "info"} onClick={() => setFilter("info")} />
      </div>

      <div className="flex flex-col gap-2">
        {visible.length === 0 && (
          <p className="text-xs text-black/40 text-center py-10">Nothing here.</p>
        )}
        {visible.map((n) => (
          <NotificationCard
            key={n.id}
            notification={n}
            responded={respondedIds[n.id]}
            onOpen={() => markAsRead(n.id)}
            onDismiss={() => dismiss(n.id)}
            onRespond={(choice) => respond(n.id, choice)}
          />
        ))}
      </div>
    </div>
  );
}

function FilterTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`h-8 px-3 rounded-tab text-[11px] font-semibold flex items-center gap-1.5 transition-colors ${
        active ? "bg-black text-white" : "bg-field text-black hover:opacity-80"
      }`}
    >
      {label}
      <span className={active ? "text-white/70" : "text-black/50"}>{count}</span>
    </button>
  );
}

function NotificationCard({
  notification,
  responded,
  onOpen,
  onDismiss,
  onRespond,
}: {
  notification: Notification;
  responded?: "accepted" | "declined";
  onOpen: () => void;
  onDismiss: () => void;
  onRespond: (choice: "accepted" | "declined") => void;
}) {
  const n = notification;

  return (
    <div
      className={`relative rounded-input p-3.5 border transition-colors ${
        n.read ? "border-black/5 bg-white" : "border-black/10 bg-field/40"
      }`}
    >
      {!n.read && <span className="absolute left-1.5 top-1.5 w-1.5 h-1.5 rounded-full bg-black" />}

      <button
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="absolute right-3 top-3 text-black/30 hover:text-black text-xs"
      >
        {"\u2715"}
      </button>

      <Link href={n.href} onClick={onOpen} className="flex gap-3 pr-5">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-base ${n.iconBg}`}>
          {n.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] leading-snug text-black/90">{n.text}</p>
          <p className="text-[10px] text-black/45 mt-1">{n.meta}</p>
        </div>
      </Link>

      {n.actions && !responded && (
        <div className="flex gap-2 mt-3 pl-12">
          {n.actions.map((a) => (
            <button
              key={a.label}
              onClick={(e) => {
                e.preventDefault();
                onRespond(a.label.toLowerCase() === "accept" ? "accepted" : "declined");
              }}
              className={`h-7 px-3 rounded-pill text-[11px] font-semibold ${
                a.style === "primary" ? "bg-black text-white" : "bg-white text-black border border-black"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}

      {responded && (
        <div className="pl-12 mt-2">
          <span className="text-[10px] font-semibold text-black/50">
            {responded === "accepted" ? "\u2713 Accepted" : "Declined"}
          </span>
        </div>
      )}
    </div>
  );
}
