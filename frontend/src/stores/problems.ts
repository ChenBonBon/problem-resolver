import { create } from "zustand";

export interface IProblem {
  id: number;
  name: string;
  status: "unsolved" | "processing" | "solved";
  answers: number;
  passRate: number;
  difficulty: "easy" | "medium" | "hard";
}

interface IProblemsStore {
  problems: IProblem[];
  setProblems: (newProblems: IProblem[]) => void;
}

const useProblemsStore = create<IProblemsStore>((set) => ({
  problems: [],

  setProblems: (newProblems: IProblem[]) => set({ problems: newProblems }),
}));

export default useProblemsStore;
