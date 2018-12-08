import fs from "fs";
import path from "path";
import { promisify } from "util";

export function loadMockPage(fileName: string): Promise<String> {
    const filePath = path.resolve(
        __dirname,
        "../tests/mock-pages/",
        fileName + ".html"
    );
    const readFile = promisify(fs.readFile);
    return readFile(filePath, { encoding: "utf-8" });
}
