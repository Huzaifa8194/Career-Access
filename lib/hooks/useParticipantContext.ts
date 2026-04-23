"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/firebase/auth";
import {
  fetchParticipantByEmail,
  fetchParticipantById,
  fetchParticipantByUserId,
  type ParticipantListItem,
} from "@/lib/services/participants";

export type ParticipantContext = {
  loading: boolean;
  participant: ParticipantListItem | null;
  participantId: string | null;
};

export function useParticipantContext(): ParticipantContext {
  const { user, profile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [participant, setParticipant] = useState<ParticipantListItem | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (authLoading) return;
      if (!user) {
        setParticipant(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        let p: ParticipantListItem | null = null;
        if (profile?.participantId) {
          p = await fetchParticipantById(profile.participantId);
        }
        if (!p) {
          p = await fetchParticipantByUserId(user.uid);
        }
        if (!p && user.email) {
          p = await fetchParticipantByEmail(user.email);
        }
        if (!cancelled) setParticipant(p);
      } catch {
        if (!cancelled) setParticipant(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user, profile?.participantId, authLoading]);

  return {
    loading: loading || authLoading,
    participant,
    participantId: participant?.id ?? null,
  };
}
