import { readFile } from "fs/promises";
import { join } from "path";
import constants from "./constants";
import { User } from "./user";

const { error } = constants;

type Options = {
  maxLines: number;
  fields: string[];
};

const DEFAULT_OPTION: Options = {
  maxLines: 3,
  fields: ["id", "name", "profession", "age"],
};

export class File {
  static async csvToJson(filePath: string) {
    const content = await File.getFileContent(filePath);
    const validation = File.isValid(content);

    if (!validation.valid) throw new Error(validation.error);

    const users = File.parseCsvToJson(content);
    return users;
  }

  static async getFileContent(filePath: string) {
    const filename = join(__dirname, filePath);
    return (await readFile(filename)).toString("utf8");
  }

  static parseCsvToJson(csvString: string) {
    const lines = csvString.split("\n");

    //remove o primeiro item e joga na variável
    const firstLine = lines.shift();

    const header = firstLine!.split(",");

    const users = lines.map((line: string) => {
      const columns = line.split(",");
      let user: any = {};
      for (const index in columns) {
        user[header[index]] = columns[index];
      }
      return new User(user);
    });
    return users;
  }

  static isValid(csvString: string, options: Options = DEFAULT_OPTION) {
    const [header, ...fileWithoutHeader] = csvString.split(/\r?\n/);

    const isHeaderValid = header === options.fields.join(",");

    if (!isHeaderValid) {
      return {
        error: error.FILE_FIELDS_ERROR_MESSAGE,
        valid: false,
      };
    }

    const isContentLengthAccepted =
      fileWithoutHeader.length > 0 &&
      fileWithoutHeader.length <= options.maxLines;

    if (!isContentLengthAccepted) {
      return {
        error: error.FILE_LENGTH_ERROR_MESSAGE,
        valid: false,
      };
    }

    return { valid: true };
  }
}

(async () => {
  // const result = await File.csvToJson("../mocks/emptyFile-invalid.csv");
  // const result = await File.csvToJson("../mocks/fourItems-invalid.csv");
  // const result = await File.csvToJson("../mocks/invalid-header.csv");
  const result = await File.csvToJson("../mocks/threeItems-valid.csv");

  console.log("result", result);
})();
