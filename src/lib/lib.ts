import { base } from '$app/paths';

export async function loadFile(filePath: string): Promise<string> {
    const absolutePath = `${base}/${filePath}`;
    const response = await fetch(absolutePath);

    if (!response.ok) {
      throw new Error(`Failed to load file: ${response.statusText}`);
    }

    return await response.text();
  }

export function delay(time:number) {
    return new Promise(resolve => setTimeout(resolve, time));
  }