/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as readline from "readline";
import * as process from "process";

/**
 * 質問文と型
 */
export type MessageAndType<T extends TypeKey> = {
  readonly type: T;
  readonly message: string;
};

/**
 * 質問文と型を指定する. 補完を得るためのもの.
 */
export const createMessageAndType = <T extends TypeKey>(
  messageAndType: MessageAndType<T>
): MessageAndType<T> => {
  return messageAndType;
};

export type TypeKey = "text" | "number" | "boolean";

type TypeKeyToTypeMap = {
  readonly text: string;
  readonly number: number;
  readonly boolean: boolean;
};

/**
 * ユーザーに複数の質問する
 * @param questions 質問
 * @returns ユーザから入力された答え
 */
export const askQuestions = async <
  Questions extends { [key in string]: MessageAndType<TypeKey> }
>(
  questions: Questions
): Promise<{
  [key in keyof Questions]: TypeKeyToTypeMap[Questions[key]["type"]];
}> => {
  const answers: {
    [key in keyof Questions]?: TypeKeyToTypeMap[TypeKey];
  } = {};

  for (const [name, messageAndType] of Object.entries(
    questions
  ) as ReadonlyArray<[keyof Questions, MessageAndType<TypeKey>]>) {
    answers[name] = await askQuestion(messageAndType);
  }

  return answers as {
    [key in keyof Questions]: TypeKeyToTypeMap[Questions[key]["type"]];
  };
};

/**
 * ユーザーに質問をする
 */
export const askQuestion = async <T extends TypeKey>({
  message,
  type,
}: MessageAndType<T>): Promise<TypeKeyToTypeMap[T]> => {
  while (true) {
    const result = await getUserInput(message);
    const answerResult = userInputToAnswer(type, result);
    if (answerResult !== undefined) {
      return answerResult;
    }
    console.error("invalid value");
  }
};

/**
 * ユーザーが入力した文字列を受け取る
 */
const getUserInput = (message: string): Promise<string> =>
  new Promise((resolve) => {
    const reader = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    reader.question("? " + message + " > ", (text) => {
      reader.close();
      resolve(text);
    });
  });

/**
 * ユーザーが入力した文字列を解析する
 */
const userInputToAnswer = <T extends TypeKey>(
  typeString: T,
  result: string
): TypeKeyToTypeMap[T] | undefined => {
  switch (typeString) {
    case "text": {
      if (result !== "") {
        return result as TypeKeyToTypeMap[T];
      }
      return undefined;
    }

    case "number": {
      const value = Number.parseInt(result);
      if (!Number.isNaN(value)) {
        return value as TypeKeyToTypeMap[T];
      }
      return undefined;
    }

    case "boolean": {
      switch (result.trim().toLowerCase()) {
        case "y":
          return true as TypeKeyToTypeMap[T];

        case "n":
          return false as TypeKeyToTypeMap[T];
      }
      return undefined;
    }
  }
};
