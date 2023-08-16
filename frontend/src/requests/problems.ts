export async function getProblems() {
  const res = await fetch("/api/problems", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
}
