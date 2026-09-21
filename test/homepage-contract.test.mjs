import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");

test("Jekyll foundation is pinned and strict", () => {
  for (const path of [".ruby-version", "Gemfile", "_config.yml", ".gitignore"]) {
    assert.equal(existsSync(path), true, `${path} must exist`);
  }

  assert.equal(read(".ruby-version").trim(), "3.3.4");

  const gemfile = read("Gemfile");
  assert.match(
    gemfile,
    /gem "github-pages", "~> 232", group: :jekyll_plugins/
  );
  assert.doesNotMatch(gemfile, /remote-theme|minima/);

  const config = read("_config.yml");
  assert.match(config, /^title: "Joel_Chen JH \/ NOTES"$/m);
  assert.match(config, /^lang: zh-CN$/m);
  assert.match(config, /^\s+error_mode: strict$/m);
  assert.match(config, /^\s+strict_filters: true$/m);
  assert.match(config, /^\s+strict_variables: true$/m);
  assert.doesNotMatch(config, /^\s*theme:/m);
});

test("home data contains the approved copy and two real articles", () => {
  assert.equal(existsSync("_data/home.yml"), true);
  const data = read("_data/home.yml");

  for (const text of [
    "知识，在阅读与",
    "实践之间生长",
    "记录思考，整理方法，连接灵感。",
    "如何搭建一个",
    "长期生长的个人博客",
    "设计系统",
    "Linux 笔记",
    "持续阅读",
    "持续实践",
    "成为更好的自己",
    "2026.09.20"
  ]) {
    assert.ok(data.includes(text), `missing copy: ${text}`);
  }

  assert.equal((data.match(/^\s+- number: "0[12]"$/gm) ?? []).length, 2);
  assert.match(data, /^article_placeholder:$/m);
  assert.match(data, /^\s+number: "03"$/m);
  assert.match(data, /^\s+accent: yellow$/m);
  assert.doesNotMatch(data, /^site_identity:/m);
});
