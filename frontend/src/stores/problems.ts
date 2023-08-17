import { create } from "zustand";

export interface IProblemBase {
  id: string;
  name: string;
  status: "unsolved" | "processing" | "solved";
  answers: number;
  passRate: number;
  difficulty: "easy" | "medium" | "hard";
}

export interface IProblem extends IProblemBase {
  description: string;
  comments: number;
  examples: IExample[];
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
