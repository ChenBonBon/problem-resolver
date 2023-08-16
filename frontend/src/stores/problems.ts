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

interface IProblemsStore {
  problems: IProblemBase[];
  setProblems: (newProblems: IProblemBase[]) => void;
}

const useProblemsStore = create<IProblemsStore>((set) => ({
  problems: [],

  setProblems: (newProblems: IProblemBase[]) => set({ problems: newProblems }),
}));

export default useProblemsStore;
