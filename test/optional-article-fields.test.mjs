import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const output = "_site-optional/index.html";
const html = existsSync(output) ? readFileSync(output, "utf8") : "";

test("optional article fixture renders no empty semantic elements", () => {
  assert.equal(existsSync(output), true, "fixture site must be built first");

  const list = html.match(/<ol class="article-list">([\s\S]*?)<\/ol>/)?.[1] ?? "";
  const rows = list.match(/<li class="article-row">/g) ?? [];
  const dates = list.match(/<time class="article-row__date"/g) ?? [];

  assert.equal(rows.length, 5, "blank or missing titles must omit their rows");
  assert.equal(dates.length, 1, "only a complete, nonblank date pair may render");
  assert.match(list, /完整文章/);
  assert.match(list, /仅标题/);
  assert.match(list, /缺少 ISO 日期/);
  assert.match(list, /空白日期/);
  assert.match(list, /空白 ISO 日期/);
  assert.doesNotMatch(list, /缺少标题|空白标题/);
  assert.doesNotMatch(list, /<h3[^>]*>\s*<\/h3>/);
  assert.doesNotMatch(list, /<time[^>]*datetime="\s*"/);
  assert.doesNotMatch(list, /<time[^>]*>\s*<\/time>/);
  assert.doesNotMatch(list, /<span class="number-mark[^>]*>\s*<span>\s*<\/span>/);
});
