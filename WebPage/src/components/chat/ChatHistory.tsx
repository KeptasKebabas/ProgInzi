import { useEffect, useMemo, useState } from "react";

export interface ChatSession {
  id: string;
  title: string;
  /** Unix ms for display + `datetime` on `<time>` */
  timestamp: number;
}

const MAX_CHAT_TITLE_LENGTH = 60;

export interface ChatHistoryProps {
  sessions: ChatSession[];
  /** Which session is open in the main chat (drives list highlight). */
  activeSessionId?: string | null;
  /** Called when the user selects a session (navigation wired later). */
  onSelectSession?: (sessionId: string) => void;
  /** Called when the user starts a new chat (parent adds a session, resets chat, etc.). */
  onCreateNewChat?: () => void;
  /**
   * Called when the user renames a chat.
   * Throw/reject to report a save failure; the UI will keep edit mode and show retry feedback.
   */
  onRenameSession?: (sessionId: string, title: string) => void | Promise<void>;
}

function formatSessionTime(ms: number): string {
  const d = new Date(ms);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatHistory({
  sessions,
  activeSessionId = null,
  onSelectSession,
  onCreateNewChat,
  onRenameSession,
}: ChatHistoryProps) {
  const hasSessions = sessions.length > 0;
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savingSessionId, setSavingSessionId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const editingSession = useMemo(
    () => sessions.find((s) => s.id === editingSessionId) ?? null,
    [sessions, editingSessionId],
  );

  useEffect(() => {
    if (!toastMessage) return;
    const t = window.setTimeout(() => setToastMessage(null), 1800);
    return () => window.clearTimeout(t);
  }, [toastMessage]);

  useEffect(() => {
    if (!editingSessionId) return;
    if (!sessions.some((s) => s.id === editingSessionId)) {
      setEditingSessionId(null);
      setDraftTitle("");
      setValidationError(null);
      setSaveError(null);
    }
  }, [sessions, editingSessionId]);

  const beginEdit = (session: ChatSession) => {
    setEditingSessionId(session.id);
    setDraftTitle(session.title);
    setValidationError(null);
    setSaveError(null);
  };

  const cancelEdit = () => {
    setEditingSessionId(null);
    setDraftTitle("");
    setValidationError(null);
    setSaveError(null);
    setSavingSessionId(null);
  };

  const validateTitle = (raw: string): string | null => {
    const trimmed = raw.trim();
    if (!trimmed) return "Chat name cannot be empty.";
    if (trimmed.length > MAX_CHAT_TITLE_LENGTH) {
      return `Chat name must be ${MAX_CHAT_TITLE_LENGTH} characters or less.`;
    }
    const lowerTrimmed = trimmed.toLocaleLowerCase();
    const duplicate = sessions.some(
      (s) =>
        s.id !== editingSessionId &&
        s.title.trim().toLocaleLowerCase() === lowerTrimmed,
    );
    if (duplicate) {
      return "A chat with this name already exists.";
    }
    return null;
  };

  const saveEdit = async () => {
    if (!editingSession) return;
    const err = validateTitle(draftTitle);
    if (err) {
      setValidationError(err);
      return;
    }
    setValidationError(null);
    setSaveError(null);
    const trimmed = draftTitle.trim();
    setSavingSessionId(editingSession.id);
    try {
      await onRenameSession?.(editingSession.id, trimmed);
      setToastMessage("Chat name updated");
      cancelEdit();
    } catch {
      setSaveError("Could not update chat name. Please try again.");
      setSavingSessionId(null);
    }
  };

  return (
    <aside className="chat-history" aria-label="Chat sessions">
      <button
        type="button"
        className="btn chat-history-new"
        onClick={() => onCreateNewChat?.()}
      >
        Create new chat
      </button>
      {toastMessage && (
        <div className="chat-history-toast" role="status" aria-live="polite">
          {toastMessage}
        </div>
      )}
      <h3 className="chat-history-title">Chats</h3>
      <div className="chat-history-body">
        {!hasSessions ? (
          <p className="chat-history-empty" role="status">
            No chat history yet
          </p>
        ) : (
          <ul className="chat-history-list">
            {sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const isEditing = session.id === editingSessionId;
              const isSaving = session.id === savingSessionId;
              return (
              <li key={session.id}>
                {!isEditing ? (
                  <div className="chat-history-item-wrap">
                    <button
                      type="button"
                      className={
                        "chat-history-item" +
                        (isActive ? " chat-history-item--active" : "")
                      }
                      aria-current={isActive ? "true" : undefined}
                      onClick={() => onSelectSession?.(session.id)}
                    >
                      <span className="chat-history-item-title">{session.title}</span>
                      <time
                        className="chat-history-item-time"
                        dateTime={new Date(session.timestamp).toISOString()}
                      >
                        {formatSessionTime(session.timestamp)}
                      </time>
                    </button>
                    <button
                      type="button"
                      className="chat-history-edit-trigger"
                      aria-label={`Edit name for ${session.title}`}
                      title="Edit chat name"
                      onClick={() => beginEdit(session)}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="chat-history-edit">
                    <label
                      htmlFor={`chat-rename-${session.id}`}
                      className="visually-hidden"
                    >
                      Edit chat name
                    </label>
                    <input
                      id={`chat-rename-${session.id}`}
                      className="chat-history-edit-input"
                      type="text"
                      value={draftTitle}
                      maxLength={MAX_CHAT_TITLE_LENGTH}
                      onChange={(e) => {
                        setDraftTitle(e.target.value);
                        setValidationError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          void saveEdit();
                        }
                        if (e.key === "Escape") {
                          e.preventDefault();
                          cancelEdit();
                        }
                      }}
                      autoFocus
                    />
                    <div className="chat-history-edit-actions">
                      <button
                        type="button"
                        className="chat-history-inline-btn chat-history-inline-btn--save"
                        onClick={() => void saveEdit()}
                        disabled={isSaving}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="chat-history-inline-btn"
                        onClick={cancelEdit}
                        disabled={isSaving}
                      >
                        Cancel
                      </button>
                      {saveError && (
                        <button
                          type="button"
                          className="chat-history-inline-btn chat-history-inline-btn--retry"
                          onClick={() => void saveEdit()}
                          disabled={isSaving}
                        >
                          Retry
                        </button>
                      )}
                    </div>
                    {(validationError || saveError) && (
                      <p className="chat-history-edit-error" role="alert">
                        {validationError ?? saveError}
                      </p>
                    )}
                  </div>
                )}
              </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
