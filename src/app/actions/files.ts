"use server"

import { readFile } from "node:fs/promises";


export async function checkPath(path: string) {
  try {
    const content = await readFile(path, 'utf8');
    JSON.parse(content);
    return true;
  } catch (error) {
    console.error("Error checking JSON:", error);
    return false;
  }
}

export async function loadJSON(path: string) {
  const content = await readFile(path, 'utf8');
  return JSON.parse(content);
}
