import request from ".";
import useProblemsStore, {
    ICreateProblemForm,
    IUpdateProblemForm,
} from "../stores/problems";

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

export async function updateProblem(id: number, params: IUpdateProblemForm) {
    return await request(`/api/users/problems/${id}`, "PUT", params);
}

export async function getProblem(id: number) {
    const { setProblem } = useProblemsStore.getState();
    const { setAnswer } = useProblemsStore.getState();
    const res = await request(`/api/problems/${id}`, "GET");

    if (res && res.code === 0) {
        setProblem(res.data);

        if (res.data?.answer) {
            setAnswer(res.data.answer);
        }
    }
}

export async function submitProblem(id: number, content: string) {
    const res = await request(`/api/problems/${id}`, "POST", { content });

    return res;
}
