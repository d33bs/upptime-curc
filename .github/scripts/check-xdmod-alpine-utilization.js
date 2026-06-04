const fs = require("fs");
const https = require("https");

const threshold = Number(process.env.XDMOD_ALPINE_UTILIZATION_THRESHOLD || "10");
const outputPath =
  process.env.XDMOD_ALPINE_STATUS_PATH ||
  "api/curc-xdmod-alpine-utilization-threshold/status.json";

function formatDate(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Denver",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(`HTTP ${response.statusCode}: ${body.slice(0, 200)}`));
            return;
          }
          resolve(body);
        });
      })
      .on("error", reject);
  });
}

async function main() {
  const date = formatDate(new Date());
  const filters = {
    data: [
      {
        dimension_id: "resource",
        value_id: "3",
        value_name: "Alpine",
      },
    ],
    total: 1,
  };

  const params = new URLSearchParams({
    start_date: date,
    end_date: date,
    aggregation_unit: "day",
    timeframe_label: "Custom",
    filters: JSON.stringify(filters),
    public_user: "true",
  });

  const url = `https://xdmod.rc.colorado.edu/controllers/ui_data/summary3.php?${params}`;
  const body = await get(url);
  const parsed = JSON.parse(body);

  if (!parsed.success || !parsed.data || parsed.data.length === 0) {
    throw new Error(`XDMoD query failed: ${parsed.message || "no data returned"}`);
  }

  const utilizationRaw = parsed.data[0].utilization && parsed.data[0].utilization[0];
  const utilization = Number(utilizationRaw);

  if (!Number.isFinite(utilization)) {
    throw new Error(`XDMoD utilization is not numeric: ${utilizationRaw}`);
  }

  const status = utilization >= threshold ? "UP" : "DOWN";
  const result = {
    status,
    utilization,
    threshold,
    resource: "Alpine",
    source: "CURC XDMoD public Jobs summary",
    date,
    checked_at: new Date().toISOString(),
    query_url: url,
  };

  fs.mkdirSync(require("path").dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);

  console.log(
    `Alpine XDMoD utilization ${utilization}% is ${status} with threshold ${threshold}%`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
