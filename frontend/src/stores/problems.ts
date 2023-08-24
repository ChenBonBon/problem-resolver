import { create } from "zustand";

export interface IProblemBase {
  id: number;
  name: string;
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
  name: string;
  description: string;
  answer: string;
  difficulty: string;
  types: number[];
}

export interface IUserProblem extends IProblemBase {
  createdAt: string;
  status: "disabled" | "enabled";
}

export interface IExample {
  id: number;
  input: string;
  output: string;
  explanation?: string;
}

export interface IAnswer {
  id: number;
  answer: string;
  author: string;
}

export interface IProblemType {
  id: number;
  name: string;
}

interface IProblemsStore {
  problems: IProblemListItem[];
  problem: IProblem | null;
  answer: IAnswer | null;
  problemTypes: IProblemType[];
  userProblems: IUserProblem[];

  setProblems: (newProblems: IProblemListItem[]) => void;
  setProblem: (newProblem: IProblem | null) => void;
  setAnswer: (newAnswer: IAnswer | null) => void;
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
  setAnswer: (newAnswer: IAnswer | null) => set({ answer: newAnswer }),
  setProblemTypes: (newProblemTypes: IProblemType[]) =>
    set({ problemTypes: newProblemTypes }),
  setUserProblems: (newUserProblems: IUserProblem[]) =>
    set({ userProblems: newUserProblems }),
}));

export default useProblemsStore;
