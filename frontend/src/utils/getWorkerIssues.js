// src/utils/getWorkerIssues.js
import { issuesData } from "../data/issueOptions";

export function getWorkerIssues(profession) {
  if (!profession) return [];

  // Normalize profession (e.g., "AC Technician" → "acTechnician")
  const key = profession
    .replace(/\s+/g, "")       // remove spaces
    .replace(/^./, (c) => c.toLowerCase()); // lowercase first letter

  return issuesData[key] || [];
}
