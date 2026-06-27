const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

/**
 * Submits a report against a lesson. Matches the backend's
 * `POST /api/report/submit?lessonId=...&userId=...` contract, sending
 * `reason` in the JSON body and returning the inserted report doc.
 *
 * Returns an object shaped like `{ alreadyReported, report, message }`
 * so callers can branch on the duplicate case without re-parsing the
 * backend payload. Throws an Error with `.status` on non-2xx responses.
 */
export const submitReport = async (lessonId, userId, reason) => {
  if (!lessonId) throw new Error("lessonId is required to submit a report");
  if (!userId) throw new Error("userId is required to submit a report");
  if (!reason || !String(reason).trim()) {
    throw new Error("Reason cannot be empty");
  }

  const params = new URLSearchParams({ lessonId, userId });
  const url = `${BASE_URL}/api/report/submit?${params.toString()}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ reason: String(reason).trim() }),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    // Non-JSON body; fall through to the generic error below.
  }

  if (!response.ok) {
    const error = new Error(data?.message || "Failed to submit report");
    error.status = response.status;
    error.details = data;
    throw error;
  }

  return {
    alreadyReported: Boolean(data?.alreadyReported),
    report: data?.report ?? null,
    message: data?.message || "",
  };
};
