import type { ConfigHandles } from "@configuration";
import type { DatabaseHandles } from "@database/index";

export const configChannel = (channel: keyof ConfigHandles): string => {
  return `config:${channel}`;
};

export const databaseChannel = (channel: keyof DatabaseHandles): string => {
  return `database:${channel}`;
};
