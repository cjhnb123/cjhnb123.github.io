import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const output = "_site/index.html";
const html = existsSync(output) ? readFileSync(output, "utf8") : "";

test("Jekyll generated the homepage", () => {
  assert.equal(existsSync(output), true, "_site/index.html must exist");
  assert.match(html, /<html lang="zh-CN">/);
  assert.match(html, /<header\b/);
  assert.match(html, /<main\b[^>]*id="main-content"/);
  assert.match(html, /<footer\b/);
  assert.doesNotMatch(html, /{{|{%/);
  assert.doesNotMatch(html, /<script\b/i);
});

test("all fragment links resolve to unique IDs", () => {
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, "IDs must be unique");

  const targets = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
  for (const target of targets) {
    assert.equal(ids.includes(target), true, `missing #${target}`);
  }
});

test("article semantics contain two articles and one hidden placeholder", () => {
  const articleItems = html.match(/<li class="article-row">/g) ?? [];
  assert.equal(articleItems.length, 2);
  assert.match(
    html,
    /class="article-row article-row--placeholder" aria-hidden="true"/
  );
  assert.doesNotMatch(html, /href="(?:#)?"/);
});

test("every generated local stylesheet exists", () => {
  const stylesheets = [...html.matchAll(/href="([^"]+\.css)"/g)]
    .map((match) => match[1])
    .filter((href) => href.startsWith("/"));

  for (const href of stylesheets) {
    const generatedPath = join("_site", href.replace(/^\//, ""));
    assert.equal(existsSync(generatedPath), true, `${href} must exist`);
  }
});
