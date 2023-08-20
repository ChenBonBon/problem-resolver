import { create } from "zustand";

export interface IProblemBase {
  id: string;
  name: string;
  group: string;
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

export interface IUserProblem extends IProblemBase {
  createdAt: string;
  status: "disabled" | "enabled";
}

export interface IExample {
  id: string;
  input: string;
  output: string;
  explanation?: string;
}

export interface IAnswer {
  id: string;
  answer: string;
  author: string;
}

interface IProblemsStore {
  problems: IProblemBase[];
  problem: IProblem | null;
  answer: IAnswer | null;
  setProblems: (newProblems: IProblemBase[]) => void;
  setProblem: (newProblem: IProblem | null) => void;
  setAnswer: (newAnswer: IAnswer | null) => void;
}

const useProblemsStore = create<IProblemsStore>((set) => ({
  problems: [],
  problem: null,
  answer: null,

  setProblems: (newProblems: IProblemBase[]) => set({ problems: newProblems }),
  setProblem: (newProblem: IProblem | null) => set({ problem: newProblem }),
  setAnswer: (newAnswer: IAnswer | null) => set({ answer: newAnswer }),
}));

export default useProblemsStore;
