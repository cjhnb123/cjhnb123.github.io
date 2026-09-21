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

test("Liquid templates expose the required semantic structure", () => {
  for (const path of [
    "_layouts/default.html",
    "_includes/header.html",
    "_includes/footer.html",
    "index.html"
  ]) {
    assert.equal(existsSync(path), true, `${path} must exist`);
  }

  const layout = read("_layouts/default.html");
  assert.match(layout, /<html lang="{{ site\.lang }}">/);
  assert.match(layout, /class="skip-link" href="#main-content"/);
  assert.match(layout, /{% include header\.html %}/);
  assert.match(layout, /{% include footer\.html %}/);
  assert.doesNotMatch(layout, /<script\b/i);

  const header = read("_includes/header.html");
  assert.match(header, /href="#{{ item\.target }}"/);
  assert.match(header, /{{ site\.title }}/);

  const page = read("index.html");
  for (const id of ["main-content", "about", "featured", "articles", "learning"]) {
    assert.match(page, new RegExp(`id="${id}"`));
  }
  assert.match(page, /for article in site\.data\.home\.articles/);
  assert.match(page, /article contains "title"/);
  assert.match(page, /article contains "date"/);
  assert.match(page, /article-row--placeholder/);
  assert.match(page, /aria-hidden="true"/);
  assert.doesNotMatch(page, /href=""/);
  assert.doesNotMatch(page, /href="#"/);
});

test("article rows require nonblank titles and omit incomplete optional fields", () => {
  const page = read("index.html");

  assert.match(page, /assign article_title = article\.title \| strip/);
  assert.match(page, /if article_title != blank/);
  assert.match(page, /assign article_date = article\.date \| strip/);
  assert.match(page, /assign article_iso_date = article\.iso_date \| strip/);
  assert.match(page, /if article_date != blank and article_iso_date != blank/);
  assert.match(page, /assign article_number = article\.number \| strip/);
  assert.match(page, /assign article_accent = article\.accent \| strip/);
  assert.match(page, /if article_number != blank and article_accent != blank/);
});

test("styles define the approved tokens and shared accessibility rules", () => {
  for (const path of [
    "_sass/_tokens.scss",
    "_sass/_base.scss",
    "assets/css/main.scss"
  ]) {
    assert.equal(existsSync(path), true, `${path} must exist`);
  }

  const tokens = read("_sass/_tokens.scss").toLowerCase();
  for (const color of [
    "#f8f7f3",
    "#f2f1ed",
    "#111111",
    "#6c6b68",
    "#1769e8",
    "#e8372f",
    "#f5be20"
  ]) {
    assert.ok(tokens.includes(color), `missing color: ${color}`);
  }
  assert.match(tokens, /georgia/);
  assert.match(tokens, /noto serif sc/);
  assert.match(tokens, /pingfang sc/);

  const base = read("_sass/_base.scss");
  assert.match(base, /max-width:\s*\$page-max/);
  assert.match(base, /:focus-visible/);
  assert.match(base, /scroll-margin-top/);

  const entry = read("assets/css/main.scss");
  for (const partial of ["tokens", "base", "home", "responsive"]) {
    assert.ok(entry.includes(`@import "${partial}"`), `missing import: ${partial}`);
  }
});

test("desktop styles implement approved grids and only gray-red artwork", () => {
  assert.equal(existsSync("_sass/_home.scss"), true);
  const css = read("_sass/_home.scss");

  assert.match(css, /\.home-hero\s*{[\s\S]*grid-template-columns:/);
  assert.match(css, /\.home-content\s*{[\s\S]*grid-template-columns:/);
  assert.match(css, /\.feature-art__gray/);
  assert.match(css, /\.feature-art__red/);
  assert.doesNotMatch(css, /feature-art__(blue|yellow|black)/);
  assert.match(css, /\.number-mark__line/);
  assert.match(css, /\.number-mark__square/);
  assert.match(css, /\.manifesto__arc/);
  assert.doesNotMatch(css, /height:\s*100vh/);
});

test("responsive CSS pins every approved boundary and overflow safeguard", () => {
  assert.equal(existsSync("_sass/_responsive.scss"), true);
  const css = read("_sass/_responsive.scss");

  assert.match(css, /min-width:\s*1025px/);
  assert.match(css, /min-width:\s*768px/);
  assert.match(css, /max-width:\s*1024px/);
  assert.match(css, /max-width:\s*767px/);
  assert.match(css, /max-width:\s*419px/);
  assert.match(css, /padding-inline:\s*20px/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /overflow-wrap:\s*anywhere/);
  assert.match(css, /\.site-brand\s*\{[^}]*min-height:\s*44px/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /transition:\s*none/);
});
