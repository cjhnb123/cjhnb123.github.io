# Joel_Chen JH / NOTES

Personal Jekyll homepage for https://cjhnb123.github.io.

## Requirements

- Ruby 3.3.4
- Bundler
- Node.js 24

## Local preview

    bundle install
    bundle exec jekyll serve --strict_front_matter

Open http://127.0.0.1:4000/.

## Verification

    node --test test/homepage-contract.test.mjs
    bundle exec jekyll build --strict_front_matter --trace
    node --test test/generated-homepage.test.mjs

The blog/homepage branch is validated by .github/workflows/validate.yml.
