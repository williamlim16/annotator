import { readdirSync } from "fs";

export function ListFiles(path: string) {
  return readdirSync(path)
}