"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { readLearningQueue } from "@/lib/cat/conversation-learning-bridge";
import {
  approveForCatLearning,
  createImprovementProposal,
  generateRegressionTestCandidate,
  listReviewableRecords,
  markRecordReviewed,
  populateLessonLibraries,
  promoteToEngineeringTask,
  readLearningStore,
  rejectLearningRecord,
  syncQueuedSubmissions,
  type AnalyzedConversationRecord,
  type ApprovedLesson,
} from "@/lib/cat/conversation-learning";

const statusLabels: Record<string, string> = {
  queued: "Queued",
  analyzed: "Analyzed",
  reviewed: "Reviewed",
  approved: "Approved",
  rejected: "Rejected",
  promoted_to_task: "Promoted to task",
};

export default function ConversationLearningCenter() {
  const [records, setRecords] = useState<AnalyzedConversationRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [reviewer, setReviewer] = useState("founder");
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    syncQueuedSubmissions(readLearningQueue(), () => null);
    setRecords(listReviewableRecords());
    setRefreshKey((value) => value + 1);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const selectedRecord = useMemo(
    () => records.find((record) => record.id === selectedId) ?? null,
    [records, selectedId],
  );

  const store = useMemo(() => readLearningStore(), [refreshKey]);
  const selectedLesson = useMemo(() => {
    if (!selectedRecord) return null;
    return (
      store.approvedLessons.find(
        (lesson) => lesson.analyzedRecordId === selectedRecord.id,
      ) ?? null
    );
  }, [selectedRecord, store.approvedLessons]);

  const handleApprove = () => {
    if (!selectedRecord) return;
    markRecordReviewed(selectedRecord.id, notes);
    approveForCatLearning(selectedRecord.id, reviewer, notes);
    const lesson = readLearningStore().approvedLessons.at(-1);
    if (lesson) populateLessonLibraries(lesson.id);
    refresh();
  };

  const handleReject = () => {
    if (!selectedRecord) return;
    rejectLearningRecord(selectedRecord.id, reviewer, notes);
    refresh();
  };

  const handleGenerateRegression = () => {
    if (!selectedLesson) return;
    generateRegressionTestCandidate(selectedLesson.id);
    refresh();
  };

  const handleCreateProposal = () => {
    if (!selectedLesson) return;
    createImprovementProposal(selectedLesson.id);
    refresh();
  };

  const handlePromote = (lesson: ApprovedLesson) => {
    const proposal = lesson.improvementProposals.at(-1);
    if (!proposal) return;
    promoteToEngineeringTask(lesson.id, proposal.id, reviewer, notes);
    refresh();
  };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <section className="rounded-xl border border-white/10 bg-slate/40 p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Review Queue</h2>
            <p className="mt-1 text-sm text-silver">
              Raw conversations stay separate until you approve a lesson.
            </p>
          </div>
          <button
            type="button"
            onClick={refresh}
            className="min-h-10 rounded-lg border border-white/15 px-3 text-sm text-white hover:bg-white/5"
          >
            Refresh
          </button>
        </div>

        <ul className="space-y-2">
          {records.length === 0 ? (
            <li className="rounded-lg border border-white/10 bg-black/30 px-4 py-6 text-sm text-stone">
              No learning-eligible conversations are waiting for review.
            </li>
          ) : (
            records.map((record) => (
              <li key={record.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(record.id)}
                  className={[
                    "w-full rounded-lg border px-4 py-3 text-left transition-colors",
                    selectedId === record.id
                      ? "border-red/40 bg-red/10"
                      : "border-white/10 bg-black/30 hover:border-white/20",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-white">
                      {record.industry ?? "Business"} · {record.sessionId.slice(-8)}
                    </span>
                    <span className="text-xs uppercase tracking-wide text-stone">
                      {statusLabels[record.status] ?? record.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-silver">
                    {record.messageCount} messages · {record.patterns.slice(0, 2).join(", ")}
                  </p>
                </button>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="rounded-xl border border-white/10 bg-slate/40 p-5">
        {!selectedRecord ? (
          <p className="text-sm text-silver">Select a conversation record to review.</p>
        ) : (
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-red">Analyzed Record</p>
              <h2 className="mt-1 text-xl font-semibold text-white">
                {selectedRecord.industry ?? "Business conversation"}
              </h2>
              <p className="mt-2 text-sm text-silver">
                Patterns: {selectedRecord.patterns.join(", ")}
              </p>
              {selectedRecord.frictionThemes.length > 0 ? (
                <p className="mt-1 text-sm text-silver">
                  Friction: {selectedRecord.frictionThemes.join(", ")}
                </p>
              ) : null}
            </div>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone">Reviewer notes</span>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
                placeholder="Optional review notes"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone">Reviewer</span>
              <input
                value={reviewer}
                onChange={(event) => setReviewer(event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleApprove}
                className="min-h-11 rounded-xl bg-red px-4 text-sm font-semibold text-white hover:bg-red-hover"
              >
                Approve for CAT Learning
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="min-h-11 rounded-xl border border-white/15 px-4 text-sm text-white hover:bg-white/5"
              >
                Reject
              </button>
            </div>

            {selectedLesson ? (
              <div className="space-y-4 border-t border-white/10 pt-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-red">Approved Lesson</p>
                  <h3 className="mt-1 text-lg font-semibold text-white">{selectedLesson.title}</h3>
                  <p className="mt-2 text-sm text-silver">{selectedLesson.summary}</p>
                  <p className="mt-2 text-xs text-stone">
                    Approved by {selectedLesson.approvedBy} at{" "}
                    {new Date(selectedLesson.approvedAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleGenerateRegression}
                    className="min-h-10 rounded-lg border border-white/15 px-4 text-sm text-white hover:bg-white/5"
                  >
                    Generate Regression Test Candidate
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateProposal}
                    className="min-h-10 rounded-lg border border-white/15 px-4 text-sm text-white hover:bg-white/5"
                  >
                    Create Improvement Proposal
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePromote(selectedLesson)}
                    disabled={selectedLesson.improvementProposals.length === 0}
                    className="min-h-10 rounded-lg border border-white/15 px-4 text-sm text-white hover:bg-white/5 disabled:opacity-40"
                  >
                    Promote to Engineering Task
                  </button>
                </div>

                {selectedLesson.regressionTestCandidates.length > 0 ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone">
                      Regression candidates
                    </p>
                    <ul className="mt-2 space-y-2 text-sm text-silver">
                      {selectedLesson.regressionTestCandidates.map((candidate) => (
                        <li key={candidate.id} className="rounded-lg border border-white/10 bg-black/20 p-3">
                          <p className="font-medium text-white">{candidate.title}</p>
                          <p className="mt-1">{candidate.scenario}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {selectedLesson.improvementProposals.length > 0 ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone">
                      Improvement proposals
                    </p>
                    <ul className="mt-2 space-y-2 text-sm text-silver">
                      {selectedLesson.improvementProposals.map((proposal) => (
                        <li key={proposal.id} className="rounded-lg border border-white/10 bg-black/20 p-3">
                          <p className="font-medium text-white">{proposal.title}</p>
                          <p className="mt-1">{proposal.description}</p>
                          {proposal.engineeringTaskRef ? (
                            <p className="mt-2 text-xs text-stone">
                              Engineering task: {proposal.engineeringTaskRef}
                            </p>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="border-t border-white/10 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone">Audit trail</p>
              <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto text-xs text-stone">
                {store.auditLog
                  .filter((entry) => entry.recordId === selectedRecord.id)
                  .map((entry) => (
                    <li key={entry.id}>
                      {entry.timestamp} · {entry.action}
                      {entry.approvedBy ? ` · ${entry.approvedBy}` : ""}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
