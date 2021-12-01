import * as fs from "fs";
import * as process from "process";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { cli } from "./cli.mjs";

const questions = [
  {
    type: "text",
    name: "filepath",
    message: "What file path  ex) common/Button",
  },
  {
    type: "text",
    name: "classname",
    message: "What class name  ex) Button",
  },
  {
    type: "boolean",
    name: "story",
    message: "Create story(Y/n)",
  },
];

const __dirname = dirname(fileURLToPath(import.meta.url));

const main = async () => {
  console.log("Code-gen : Create Presentational Component");

  // ① 対話処理を使用
  const answers = await cli(questions);
  console.log(answers);

  console.log("Start Code Generate...");
  const from_dir = path.join(__dirname, "../scripts/template/component/");
  const to_dir = path.join(
    __dirname,
    "../src/components/" + answers["filepath"] + "/"
  );

  // ② フォルダ生成
  fs.mkdirSync(to_dir, { recursive: true });

  // ③ テンプレート生成（脳筋ポイント）
  let readcomp = fs.readFileSync(from_dir + "index.tsx", "utf-8");
  readcomp = readcomp.replace(/COMPONENTTEMPLATE/g, answers["classname"]);
  fs.writeFileSync(to_dir + "index.tsx", readcomp);

  // ④ ストーリーテンプレート生成（脳筋ポイント2）
  if (answers["story"]) {
    let readstory = fs.readFileSync(
      from_dir + "componenttemplate.stories.tsx",
      "utf-8"
    );
    readstory = readstory.replace(/COMPONENTFILEPATH/g, answers["filepath"]);
    readstory = readstory.replace(/COMPONENTTEMPLATE/g, answers["classname"]);
    fs.writeFileSync(
      to_dir + answers["classname"].toLowerCase() + ".stories.tsx",
      readstory
    );
  }
  console.log("Succeded!!");
  process.exit();
};

(async () => {
  await main();
})();
