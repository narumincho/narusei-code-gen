/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as readline from "readline";
import * as process from "process";

const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// ④で使用
const getAnswer = (msg) =>
  new Promise((res) => reader.question("? " + msg + " > ", res));

// ① 複数の質問を引数に取る
export const cli = async (questions = []) => {
  const answers = {};
  let answer, question;
  let name, type, message; // ② 各質問の構成要素
  let result;

  // ③ それぞれ質問をしていく
  for (question of questions) {
    result = "";
    ({ name, type, message } = question);

    // ④　ユーザの入力を待ち受ける
    result = await getAnswer(message);

    // ⑤ typeに合わせて簡単に値のチェックを行う
    switch (type) {
      case "text":
        if (result !== "") {
          answer = result;
        } else {
          console.log("Invalid value");
        }
        break;

      case "number":
        if (result !== "" && parseInt(result)) {
          answer = parseInt(result);
        } else {
          console.log("Invalid value");
        }
        break;

      case "boolean":
        if (result.toLowerCase() === "y" || result.toLowerCase() === "n") {
          switch (result.toLowerCase()) {
            case "y":
              answer = true;
              break;

            case "n":
              answer = false;
              break;
          }
        } else {
          console.log("Invalid value");
        }
        break;
    }
    // ⑥ answersに追加していく
    answers[name] = answer;
  }

  // ⑦ 返す
  return answers;
};
