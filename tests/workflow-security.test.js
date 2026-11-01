const t = require("ava");
const fs = require("fs");
const path = require("path");

const workflow = (name) => fs.readFileSync(path.join(__dirname, "..", ".github", "workflows", name), "utf8");
const pin = "DNSControl/dnscontrol-action@ae61ea8ff214e6dba00d32fd79c1e0964d84d6d0";
const dnscontrolVersion = "version: v5.7.1";

t("DNSControl workflows use the official immutable action and current input names", (t) => {
    const ci = workflow("ci.yml");
    const dnscontrol = workflow("dnscontrol.yml");
    const publish = workflow("publish.yml");

    for (const source of [ci, dnscontrol, publish]) {
        t.true(source.includes(pin));
        t.true(source.includes(dnscontrolVersion));
        t.false(source.includes("is-a-dev/dnscontrol-action"));
        t.false(/\bargs:\s*(check|push)/.test(source));
    }
    t.true(ci.includes("cmdargs: check"));
    t.true(ci.includes("creds_file: /dev/null"));
    t.true(dnscontrol.includes("cmdargs: check"));
    t.true(dnscontrol.includes("creds_file: /dev/null"));
    t.true(publish.includes("cmdargs: push"));
});

t("public CI uses hosted runners and read-only pull-request permissions", (t) => {
    const ci = workflow("ci.yml");
    t.true(ci.includes("runs-on: ubuntu-latest"));
    t.false(/runs-on:.*self-hosted/.test(ci));
    t.true(ci.includes("contents: read"));
    t.true(ci.includes("pull-requests: read"));
    t.false(ci.includes("${{ secrets."));
    t.true(ci.includes("persist-credentials: false"));
});

t("DNS publishing is main-only and writes a private correctly escaped credentials file", (t) => {
    const publish = workflow("publish.yml");
    t.true(publish.includes("if: github.ref == 'refs/heads/main'"));
    t.true(publish.includes("CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}"));
    t.true(publish.includes("RUNNER_TEMP"));
    t.true(publish.includes("os.O_EXCL"));
    t.true(publish.includes("0o600"));
    t.true(publish.includes("creds_file: ${{ runner.temp }}/dnscontrol-creds.json"));
    t.true(publish.includes('if: always()'));
    t.true(publish.includes('run: rm -f "$RUNNER_TEMP/dnscontrol-creds.json"'));
    t.false(/apitoken.*\\$CLOUDFLARE_API_TOKEN/.test(publish));
    t.false(publish.includes(".github/workflows/publish.yml"));
    t.true(publish.includes("persist-credentials: false"));
});

t("external raw API writes are main-only and pinned to an immutable action commit", (t) => {
    const rawApi = workflow("raw-api.yml");
    t.true(rawApi.includes("if: github.ref == 'refs/heads/main'"));
    t.true(rawApi.includes("cpina/github-action-push-to-another-repository@55306faa4ed53b815ae49e564af8cfb359d32ae2"));
    t.false(rawApi.includes("cpina/github-action-push-to-another-repository@main"));
    t.false(rawApi.includes(".github/workflows/raw-api.yml"));
    t.true(rawApi.includes("contents: read"));
    t.true(rawApi.includes("persist-credentials: false"));
});

t("the stale automation receives only issue and pull-request write scopes on main", (t) => {
    const stale = workflow("stale.yml");
    t.true(stale.includes("issues: write"));
    t.true(stale.includes("pull-requests: write"));
    t.true(stale.includes("if: github.ref == 'refs/heads/main'"));
});

t("every workflow uses ephemeral GitHub-hosted runners", (t) => {
    for (const name of ["ci.yml", "dnscontrol.yml", "publish.yml", "raw-api.yml", "stale.yml"]) {
        const source = workflow(name);
        t.true(source.includes("runs-on: ubuntu-latest"), name);
        t.false(/runs-on:.*self-hosted/.test(source), name);
    }
});
