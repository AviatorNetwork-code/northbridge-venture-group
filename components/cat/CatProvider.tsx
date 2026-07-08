"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { mockNeoClient } from "@/lib/neo/mock-client";
import {
  CAT_INITIAL_QUICK_REPLIES,
  CAT_STORAGE_KEY,
  CAT_WELCOME_MESSAGE,
  type CatAction,
  type CatMessage,
  type CatSession,
  type BusinessProfile,
} from "@/lib/cat/types";
import { navigationItems } from "@/components/operations/mock-data";

type CatContextValue = {
  isOpen: boolean;
  isThinking: boolean;
  messages: CatMessage[];
  quickReplies: string[];
  suggestedActions: CatAction[];
  businessProfile: BusinessProfile;
  openCat: () => void;
  closeCat: () => void;
  toggleCat: () => void;
  sendMessage: (message: string) => Promise<void>;
  clearConversation: () => void;
};

const CatContext = createContext<CatContextValue | null>(null);

function getActiveModuleId(pathname: string): string {
  const match = navigationItems.find((item) => {
    if (item.href === "/operations") {
      return pathname === "/operations";
    }

    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  });

  return match?.id ?? "dashboard";
}

function createMessage(role: CatMessage["role"], content: string, recommendations?: CatMessage["recommendations"]): CatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role,
    content,
    timestamp: new Date().toISOString(),
    recommendations,
  };
}

function createInitialSession(): CatSession {
  return {
    id: `cat-${Date.now()}`,
    messages: [createMessage("cat", CAT_WELCOME_MESSAGE)],
    businessProfile: {},
  };
}

function loadSession(): CatSession {
  if (typeof window === "undefined") {
    return createInitialSession();
  }

  try {
    const stored = window.localStorage.getItem(CAT_STORAGE_KEY);
    if (!stored) return createInitialSession();

    const parsed = JSON.parse(stored) as CatSession;
    if (!parsed.messages?.length) return createInitialSession();

    return parsed;
  } catch {
    return createInitialSession();
  }
}

export function CatProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentModule = getActiveModuleId(pathname);

  const [isOpen, setIsOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [session, setSession] = useState<CatSession>(createInitialSession);
  const [quickReplies, setQuickReplies] = useState<string[]>(CAT_INITIAL_QUICK_REPLIES);
  const [suggestedActions, setSuggestedActions] = useState<CatAction[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSession(loadSession());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(CAT_STORAGE_KEY, JSON.stringify(session));
  }, [session, hydrated]);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleActions = useCallback(
    (actions: CatAction[] | undefined, autoNavigate = false) => {
      const nextActions = actions ?? [];
      setSuggestedActions(nextActions);

      if (autoNavigate) {
        const navAction = nextActions.find((action) => action.type === "navigate" && action.href);
        if (navAction?.href) {
          router.push(navAction.href);
          setIsOpen(false);
        }
      }
    },
    [router],
  );

  const sendMessage = useCallback(
    async (message: string) => {
      const trimmed = message.trim();
      if (!trimmed) return;

      const userMessage = createMessage("user", trimmed);
      const nextSession: CatSession = {
        ...session,
        messages: [...session.messages, userMessage],
      };

      setSession(nextSession);
      setIsThinking(true);
      setQuickReplies([]);
      setSuggestedActions([]);

      const isNavigation = /take me|open|show|go to|navigate/i.test(trimmed);

      try {
        const neoResponse = await mockNeoClient.send(
          {
            sessionId: session.id,
            message: trimmed,
            context: {
              currentModule,
              businessProfile: session.businessProfile,
              operationsSnapshot: {},
            },
          },
          {
            session: nextSession,
            currentModule,
          },
        );

        const updatedProfile = {
          ...session.businessProfile,
          ...(neoResponse.profileUpdates as BusinessProfile | undefined),
        };

        const catMessage = createMessage(
          "cat",
          neoResponse.reply,
          neoResponse.recommendations,
        );

        setSession({
          ...nextSession,
          businessProfile: updatedProfile,
          messages: [...nextSession.messages, catMessage],
        });

        setQuickReplies(neoResponse.quickReplies ?? []);
        handleActions(
          neoResponse.actions?.map((action) => ({
            type: action.type === "navigate" ? "navigate" : "highlight",
            label: action.label,
            href: action.href,
          })),
          isNavigation,
        );
      } finally {
        setIsThinking(false);
      }
    },
    [currentModule, handleActions, session],
  );

  const clearConversation = useCallback(() => {
    const fresh = createInitialSession();
    setSession(fresh);
    setQuickReplies(CAT_INITIAL_QUICK_REPLIES);
    setSuggestedActions([]);
  }, []);

  const value = useMemo<CatContextValue>(
    () => ({
      isOpen,
      isThinking,
      messages: session.messages,
      quickReplies,
      suggestedActions,
      businessProfile: session.businessProfile,
      openCat: () => setIsOpen(true),
      closeCat: () => setIsOpen(false),
      toggleCat: () => setIsOpen((open) => !open),
      sendMessage,
      clearConversation,
    }),
    [
      isOpen,
      isThinking,
      session.messages,
      session.businessProfile,
      quickReplies,
      suggestedActions,
      sendMessage,
      clearConversation,
    ],
  );

  return <CatContext.Provider value={value}>{children}</CatContext.Provider>;
}

export function useCat() {
  const context = useContext(CatContext);
  if (!context) {
    throw new Error("useCat must be used within CatProvider");
  }

  return context;
}
