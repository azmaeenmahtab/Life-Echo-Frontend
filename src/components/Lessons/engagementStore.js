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
 * React hook returning the latest stats snapshot for a lesson (or null
 * if no owner has published one yet for this id). Components that read
 * this hook re-render whenever `setEngagementStats` fires.
 */
export const useEngagementStats = (lessonId) =>
  useSyncExternalStore(
    subscribe(lessonId),
    () => getSnapshot(lessonId),
    getServerSnapshot,
  );
