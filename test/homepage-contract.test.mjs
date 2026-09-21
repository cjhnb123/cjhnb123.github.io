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
