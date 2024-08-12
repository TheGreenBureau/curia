import { Officer } from "data/Persons";

interface ModalBase<T> {
  type: string;
  data: T;
  caseID: string;
}

export interface OfficerModal extends ModalBase<Officer> {
  type: "officer";
  caseNumber: string;
  matter: string;
  caseIndex: number;
  editType: "add" | "update";
}

export interface TestModal extends ModalBase<string> {
  type: "test";
  title: "Test";
}

export type Modal = OfficerModal | TestModal;
