import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const GITHUB_API = "https://api.github.com";

function headers() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN not set");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function repo(): string {
  const r = process.env.GITHUB_REPOSITORY;
  if (!r) throw new Error("GITHUB_REPOSITORY not set (e.g. owner/repo)");
  return r;
}

export async function createBranchAndApplyFix(params: {
  branchName: string;
  filePath: string;
  oldString: string;
  newString: string;
  commitMessage: string;
}): Promise<void> {
  const { branchName, filePath, oldString, newString, commitMessage } = params;

  const absPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(absPath)) throw new Error(`File not found: ${absPath}`);

  const content = fs.readFileSync(absPath, "utf8");
  if (!content.includes(oldString)) {
    throw new Error(
      `old_string not found in ${filePath} — fix may already be applied or pattern changed`
    );
  }

  execSync(`git checkout -b ${branchName}`, { stdio: "pipe" });

  const updated = content.replace(oldString, newString);
  fs.writeFileSync(absPath, updated, "utf8");

  execSync(`git add "${filePath}"`, { stdio: "pipe" });
  execSync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`, { stdio: "pipe" });
  execSync(`git push origin ${branchName}`, { stdio: "pipe" });
}

export async function openDraftPR(params: {
  title: string;
  body: string;
  branch: string;
  baseBranch?: string;
  labels?: string[];
}): Promise<string> {
  const { title, body, branch, baseBranch = "develop", labels = [] } = params;
  const r = repo();

  const prRes = await fetch(`${GITHUB_API}/repos/${r}/pulls`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ title, body, head: branch, base: baseBranch, draft: true }),
  });
  if (!prRes.ok) {
    const err = await prRes.text();
    throw new Error(`Failed to create PR: ${prRes.status} ${err}`);
  }
  const pr = (await prRes.json()) as { number: number; html_url: string };

  if (labels.length > 0) {
    await fetch(`${GITHUB_API}/repos/${r}/issues/${pr.number}/labels`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ labels }),
    });
  }

  return pr.html_url;
}

export async function openIssue(params: {
  title: string;
  body: string;
  labels?: string[];
}): Promise<{ number: number; url: string }> {
  const { title, body, labels = [] } = params;
  const r = repo();

  const res = await fetch(`${GITHUB_API}/repos/${r}/issues`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ title, body, labels }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create issue: ${res.status} ${err}`);
  }
  const issue = (await res.json()) as { number: number; html_url: string };
  return { number: issue.number, url: issue.html_url };
}

export async function closeIssue(issueNumber: number): Promise<void> {
  const r = repo();
  await fetch(`${GITHUB_API}/repos/${r}/issues/${issueNumber}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify({ state: "closed" }),
  });
}

export async function deleteBranch(branchName: string): Promise<void> {
  const r = repo();
  await fetch(`${GITHUB_API}/repos/${r}/git/refs/heads/${branchName}`, {
    method: "DELETE",
    headers: headers(),
  });
}

export function getRecentCommits(n = 10): string {
  try {
    return execSync(`git log --oneline -${n}`, { encoding: "utf8" }).trim();
  } catch {
    return "(could not retrieve git log)";
  }
}
