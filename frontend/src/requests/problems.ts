import request from ".";
import useProblemsStore, { ICreateProblemForm } from "../stores/problems";

type Status = "enabled" | "disabled";

export async function getProblems(status?: Status) {
  const { setProblems } = useProblemsStore.getState();

  let params = "";

  if (status) {
    params = `?status=${status}`;
  }

  const res = await request(`/api/problems${params}`, "GET");

  if (res && res.code === 0) {
    setProblems(res.data);
  }
}

export async function getProblemTypes(status?: Status) {
  const { setProblemTypes } = useProblemsStore.getState();
  let params = "";

  if (status) {
    params = `?status=${status}`;
  }
  const res = await request(`/api/problems/types${params}`, "GET");

  if (res && res.code === 0) {
    setProblemTypes(res.data);
  }
}

export async function addProblem(params: ICreateProblemForm) {
  return await request("/api/users/problems", "POST", params);
}

export async function getUserProblems() {
  const { setUserProblems } = useProblemsStore.getState();
  const res = await request("/api/users/problems", "Get");

  if (res && res.code === 0) {
    setUserProblems(res.data);
  }
}

export async function updateProblem(
  id: number,
  params: { [key: string]: any }
) {
  return await request(`/api/users/problems/${id}`, "PUT", params);
}

export async function getProblem(id: number) {
  const { setProblem } = useProblemsStore.getState();
  const res = await request(`/api/problems/${id}`, "GET");

  if (res && res.code === 0) {
    setProblem(res.data);
  }
}
