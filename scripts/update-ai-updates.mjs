import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const dataDir = path.join(repoRoot, "data");
const outputFile = path.join(dataDir, "ai-official-updates.json");

const MAX_ITEMS = 5;
const today = new Date().toISOString().slice(0, 10);

const TOOL_CONFIG = [
  { id: "doubao", name: "豆包", officialUrl: "https://www.doubao.com/", watchUrl: "https://www.doubao.com/", hints: ["更新", "公告", "发布", "版本", "能力"] },
  { id: "yuanqi", name: "腾讯元器", officialUrl: "https://yuanqi.tencent.com/changelog/product-changelog", watchUrl: "https://yuanqi.tencent.com/changelog/product-changelog", hints: ["更新", "发布", "功能", "版本", "动态"] },
  { id: "deepseek", name: "DeepSeek", officialUrl: "https://api-docs.deepseek.com/zh-cn/updates", watchUrl: "https://api-docs.deepseek.com/zh-cn/updates", hints: ["更新", "version", "release", "time", "deepseek-v"] },
  { id: "coze-dev", name: "扣子开发平台", officialUrl: "https://www.coze.cn/open/docs/developer_guides/changelog", watchUrl: "https://www.coze.cn/open/docs/developer_guides/changelog", hints: ["changelog", "更新", "发布", "版本"] },
  { id: "coze", name: "扣子", officialUrl: "https://www.coze.cn/", watchUrl: "https://www.coze.cn/", hints: ["更新", "公告", "发布", "版本", "活动"] },
  { id: "jimeng", name: "即梦", officialUrl: "https://jimeng.jianying.com/", watchUrl: "https://jimeng.jianying.com/", hints: ["更新", "公告", "发布", "版本", "模型"] },
  { id: "kling", name: "可灵", officialUrl: "https://klingai.com/", watchUrl: "https://klingai.com/", hints: ["更新", "公告", "发布", "版本", "模型"] },
];

const SEEDED = {
  updatedAt: "2026-04-01T10:00:00+08:00",
  date: "2026-04-01",
  tools: [
    {
      id: "doubao",
      name: "豆包",
      officialUrl: "https://www.doubao.com/",
      lastCheckedAt: "2026-04-01T10:00:00+08:00",
      lastSuccessAt: "2026-04-01T10:00:00+08:00",
      lastError: "",
      isNew: false,
      items: [{ title: "豆包大模型 2.0 发布（Pro/Lite/Mini/Code）", date: "2026-02-14", link: "https://xinwen.bjd.com.cn/content/s699016dde4b0cd719e9db090.html" }],
    },
    {
      id: "yuanqi",
      name: "腾讯元器",
      officialUrl: "https://yuanqi.tencent.com/changelog/product-changelog",
      lastCheckedAt: "2026-04-01T10:00:00+08:00",
      lastSuccessAt: "2026-04-01T10:00:00+08:00",
      lastError: "",
      isNew: false,
      items: [{ title: "升级发布页，所有发布渠道一目了然", date: "2025-10", link: "https://yuanqi.tencent.com/changelog/product-changelog" }],
    },
    {
      id: "deepseek",
      name: "DeepSeek",
      officialUrl: "https://api-docs.deepseek.com/zh-cn/updates",
      lastCheckedAt: "2026-04-01T10:00:00+08:00",
      lastSuccessAt: "2026-04-01T10:00:00+08:00",
      lastError: "",
      isNew: false,
      items: [{ title: "DeepSeek-V3.2（deepseek-chat / deepseek-reasoner）", date: "2025-12-01", link: "https://api-docs.deepseek.com/zh-cn/updates" }],
    },
    {
      id: "coze-dev",
      name: "扣子开发平台",
      officialUrl: "https://www.coze.cn/open/docs/developer_guides/changelog",
      lastCheckedAt: "2026-04-01T10:00:00+08:00",
      lastSuccessAt: "2026-04-01T10:00:00+08:00",
      lastError: "官方 changelog 页面抓取超时，先使用公开报道快照",
      isNew: false,
      items: [{ title: "扣子开发平台升级至 2.0（AgentCoding / 云端开发能力）", date: "2026-01-19", link: "https://news.qq.com/rain/a/20260119A046N700" }],
    },
    {
      id: "coze",
      name: "扣子",
      officialUrl: "https://www.coze.cn/",
      lastCheckedAt: "2026-04-01T10:00:00+08:00",
      lastSuccessAt: "2026-04-01T10:00:00+08:00",
      lastError: "",
      isNew: false,
      items: [{ title: "扣子 2.0 正式上线（Skills/Plan/Office/Coding）", date: "2026-01-19", link: "https://news.qq.com/rain/a/20260119A046N700" }],
    },
    {
      id: "jimeng",
      name: "即梦",
      officialUrl: "https://jimeng.jianying.com/",
      lastCheckedAt: "2026-04-01T10:00:00+08:00",
      lastSuccessAt: "2026-04-01T10:00:00+08:00",
      lastError: "",
      isNew: false,
      items: [{ title: "即梦 App 更新至 v2.1.5（应用宝记录）", date: "2026-03-26", link: "https://sj.qq.com/appdetail/com.bytedance.dreamina" }],
    },
    {
      id: "kling",
      name: "可灵",
      officialUrl: "https://klingai.com/",
      lastCheckedAt: "2026-04-01T10:00:00+08:00",
      lastSuccessAt: "2026-04-01T10:00:00+08:00",
      lastError: "",
      isNew: false,
      items: [{ title: "可灵 AI 2.0 升级发布（语义响应/动态质量/画质提升）", date: "2025-04-15", link: "https://news.qq.com/rain/a/20250415A08O5000" }],
    },
  ],
};

function normalizeLine(v) {
  return String(v || "").replace(/\s+/g, " ").trim();
}

function extractDate(text) {
  const m = String(text || "").match(/(20\d{2}[-/.年]\d{1,2}[-/.月]\d{1,2}日?)/);
  if (!m) return "";
  return m[1].replace(/年|月/g, "-").replace(/日/g, "").replace(/\./g, "-").replace(/\//g, "-");
}

function fingerprint(items) {
  return (items || []).slice(0, 3).map((x) => `${x.date || ""}|${x.title || ""}`).join("||");
}

function makeMirror(url) {
  return `https://r.jina.ai/http://${String(url).replace(/^https?:\/\//, "")}`;
}

async function fetchText(url) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 20000);
  try {
    const res = await fetch(makeMirror(url), { signal: ctl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

function parseItems(text, tool) {
  const lines = String(text || "").split("\n").map(normalizeLine).filter(Boolean);
  const hints = (tool.hints || []).map((x) => x.toLowerCase());
  const out = [];
  const seen = new Set();

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const lower = line.toLowerCase();
    const hit = hints.some((h) => lower.includes(h));
    const hasDate = /(20\d{2}[-/.年]\d{1,2}[-/.月]\d{1,2})/.test(line);
    if (!hit && !hasDate) continue;
    if (line.length < 6 || line.length > 140) continue;
    if (/cookie|privacy|登录|注册|download|版权所有|copyright/i.test(line)) continue;

    const date = extractDate(line) || extractDate(lines[i - 1]) || extractDate(lines[i + 1]) || "日期未标注";
    const key = `${date}|${line}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ title: line, date, link: tool.officialUrl });
    if (out.length >= MAX_ITEMS) break;
  }

  return out;
}

async function readExisting() {
  try {
    const raw = await fs.readFile(outputFile, "utf8");
    return JSON.parse(raw);
  } catch {
    return SEEDED;
  }
}

async function main() {
  await fs.mkdir(dataDir, { recursive: true });
  const prev = await readExisting();
  const prevMap = Object.fromEntries((prev.tools || []).map((x) => [x.id, x]));
  const nextTools = [];

  for (const tool of TOOL_CONFIG) {
    const oldTool = prevMap[tool.id] || {};
    const oldItems = Array.isArray(oldTool.items) ? oldTool.items : [];
    let items = oldItems;
    let lastSuccessAt = oldTool.lastSuccessAt || "";
    let lastError = "";
    let isNew = false;

    try {
      const text = await fetchText(tool.watchUrl);
      const parsed = parseItems(text, tool);
      if (parsed.length > 0) {
        const oldFp = fingerprint(oldItems);
        const newFp = fingerprint(parsed);
        isNew = Boolean(oldFp) && oldFp !== newFp;
        items = isNew || !oldItems.length ? parsed : oldItems;
        lastSuccessAt = new Date().toISOString();
      } else {
        lastError = "未解析到更新，保留最近数据";
      }
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }

    nextTools.push({
      id: tool.id,
      name: tool.name,
      officialUrl: tool.officialUrl,
      lastCheckedAt: new Date().toISOString(),
      lastSuccessAt,
      lastError,
      isNew,
      items,
    });
  }

  const output = {
    updatedAt: new Date().toISOString(),
    date: today,
    tools: nextTools,
  };

  await fs.writeFile(outputFile, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`Updated: ${outputFile}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
