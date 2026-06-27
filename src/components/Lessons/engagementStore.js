"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny pub/sub store keyed by lesson id, used to share live
 * `likesCount` / `savesCount` / `viewsCount` between the action buttons
 * (which mutate them) and the sidebar's social stats card (which only
 * reads them) — without hoisting React state across the server/client
 * boundary.
 *
 * The owner is whichever component is mounted first for a given lesson;
 * on unmount it simply leaves the last known value in the store. A new
 * page mount overwrites the entry with the server-rendered snapshot,
 * so stale data is bounded to "last visitor".
 */

const STORES = new Map();

const getStore = (lessonId) => {
  let store = STORES.get(lessonId);
  if (!store) {
    store = {
      value: null,
      listeners: new Set(),
    };
    STORES.set(lessonId, store);
  }
  return store;
};

const subscribe = (lessonId) => (listener) => {
  const store = getStore(lessonId);
  store.listeners.add(listener);
  return () => store.listeners.delete(listener);
};

const getSnapshot = (lessonId) => {
  const store = getStore(lessonId);
  return store.value;
};

const getServerSnapshot = () => null;

/**
 * Publish a new stats snapshot for a lesson. Listeners re-render on the
 * next tick; reads via `useEngagementStats` return the latest snapshot.
 */
export const setEngagementStats = (lessonId, value) => {
  if (!lessonId || value == null) return;
  const store = getStore(lessonId);
  // Same identity guard as React: skip the notification if nothing
  // actually changed, so consumers don't re-render needlessly.
  if (store.value === value) return;
  store.value = value;
  store.listeners.forEach((listener) => listener());
};

/**
 * React hook returning the latest stats snapshot for a lesson. If no
 * publisher has mounted yet for this id (e.g. the sidebar renders
 * before the action buttons), the snapshot is `null`; `fallback` is
 * returned instead so consumers can keep rendering initial values.
 *
 * Components that read this hook re-render whenever `setEngagementStats`
 * fires for the same lesson id.
 */
export const useEngagementStats = (lessonId, fallback = null) => {
  const snapshot = useSyncExternalStore(
    subscribe(lessonId),
    () => getSnapshot(lessonId),
    getServerSnapshot,
  );
  return snapshot ?? fallback;
};
