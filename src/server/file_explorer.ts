import { readdirSync } from "fs";
import { extname } from "path";

export function ListFiles(path: string) {
  return readdirSync(path).filter(file => extname(file).toLowerCase() === ".mp4");
}