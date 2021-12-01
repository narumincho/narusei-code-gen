import * as fs from "fs/promises";
import { askQuestions, createMessageAndType } from "./cli.js";

const questions = {
  filepath: createMessageAndType({
    type: "text",
    message: "What file path  ex) common/Button",
  }),
  className: createMessageAndType({
    type: "text",
    message: "What class name  ex) Button",
  }),
  story: createMessageAndType({
    type: "boolean",
    message: "Create story(Y/n)",
  }),
};

const main = async (): Promise<void> => {
  console.log("Code-gen : Create Presentational Component");

  // ① 対話処理を使用
  const answers = await askQuestions(questions);
  console.log(answers);

  console.log("Start Code Generate...");
  const fromDir = "./scripts/template/component/";
  const toDir = "./src/components/" + answers.filepath + "/";

  // ② フォルダ生成
  await fs.mkdir(toDir, { recursive: true });

  await Promise.all([
    (async () => {
      // ③ テンプレート生成
      const componentTemplate = await fs.readFile(fromDir + "index.tsx", {
        encoding: "utf-8",
      });
      await fs.writeFile(
        toDir + "index.tsx",
        componentTemplate.replace(/COMPONENTTEMPLATE/g, answers.className)
      );
    })(),
    (async () => {
      // ④ ストーリーテンプレート生成
      if (answers.story) {
        const storyTemplate = await fs.readFile(
          fromDir + "componenttemplate.stories.tsx",
          {
            encoding: "utf-8",
          }
        );
        await fs.writeFile(
          toDir + answers.className.toLowerCase() + ".stories.tsx",
          storyTemplate
            .replace(/COMPONENTFILEPATH/g, answers.filepath)
            .replace(/COMPONENTTEMPLATE/g, answers.className)
        );
      }
    })(),
  ]);

  console.log("Succeeded!!");
};

main();
