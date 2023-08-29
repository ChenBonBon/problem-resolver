import { create } from "zustand";

export interface IProblemBase {
    id: number;
    title: string;
    types: string[];
    difficulty: "easy" | "medium" | "hard";
}

export interface IProblemListItem extends IProblemBase {
    passRate: number;
    answers: number;
    status: "unsolved" | "processing" | "solved";
}

export interface IProblem extends IProblemBase {
    description: string;
    comments: number;
    answers: number;
    examples: IExample[];
}

export interface ICreateProblemForm {
    title: string;
    description?: string;
    answer?: string;
    difficulty: string;
    types?: number[];
}

export interface IUpdateProblemForm {
    title?: string;
    description?: string;
    answer?: string;
    difficulty?: string;
    types?: number[];
    status?: Status;
}

export interface IUserProblem extends IProblemBase {
    createdAt: string;
    status: Status;
}

export interface IExample {
    id: number;
    input: string;
    output: string;
    explanation?: string;
}

export interface IAnswer {
    answer: string;
}

export interface IProblemType {
    id: number;
    name: string;
}

interface IProblemsStore {
    problems: IProblemListItem[];
    problem: IProblem | null;
    answer: string | null;
    problemTypes: IProblemType[];
    userProblems: IUserProblem[];

    setProblems: (newProblems: IProblemListItem[]) => void;
    setProblem: (newProblem: IProblem | null) => void;
    setAnswer: (newAnswer: string | null) => void;
    setProblemTypes: (newProblemTypes: IProblemType[]) => void;
    setUserProblems: (newUserProblems: IUserProblem[]) => void;
}

const useProblemsStore = create<IProblemsStore>((set) => ({
    problems: [],
    problem: null,
    answer: null,
    problemTypes: [],
    userProblems: [],

    setProblems: (newProblems: IProblemListItem[]) =>
        set({ problems: newProblems }),
    setProblem: (newProblem: IProblem | null) => set({ problem: newProblem }),
    setAnswer: (newAnswer: string | null) => set({ answer: newAnswer }),
    setProblemTypes: (newProblemTypes: IProblemType[]) =>
        set({ problemTypes: newProblemTypes }),
    setUserProblems: (newUserProblems: IUserProblem[]) =>
        set({ userProblems: newUserProblems }),
}));

export default useProblemsStore;
