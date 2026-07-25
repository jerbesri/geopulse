Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyParser = exports.commonRouter = void 0;

const Router = require("@koa/router");
const createBodyParser = require("koa-bodyparser");

const router = new Router();
exports.commonRouter = router;

const info = function (ctx) {
  if (process.env.NODE_ENV === "development") {
    ctx.body = require("../../../../client/jimu-core/version.json");
  } else {
    ctx.body = require("../../../version.json");
  }
};

const setting = function (ctx) {
  ctx.body = require("../../../../setting.json");
};

/**
 * Same-origin proxy for browser widgets that cannot call Azure/APIM directly due to CORS.
 */
const aiBriefingProxy = async function (ctx) {
  try {
    const { payload, azureEndpoint, azureDeploymentName, azureApiKey } =
      ctx.request.body || {};

    if (!payload || !azureEndpoint || !azureDeploymentName || !azureApiKey) {
      ctx.status = 400;
      ctx.body = {
        error:
          "Missing one or more required fields: payload, azureEndpoint, azureDeploymentName, azureApiKey",
      };
      return;
    }

    const endpointRoot = String(azureEndpoint).replace(/\/+$/, "");
    const endpoint = `${endpointRoot}/openai/deployments/${azureDeploymentName}/chat/completions?api-version=2024-02-01`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": azureApiKey,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "You are EMS Tactical Dispatch AI. Analyze hotspot risk, incident patterns, and weather. Output exactly 2 actionable sentences for ambulance staging decisions including ALS/BLS posture and operational preparation guidance.",
          },
          {
            role: "user",
            content: `Create a concise staging briefing from this JSON: ${JSON.stringify(payload)}`,
          },
        ],
        temperature: 0.2,
        max_completion_tokens: 180,
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      ctx.status = response.status;
      ctx.body = {
        error: `Azure OpenAI request failed with status ${response.status}`,
        details: responseText,
      };
      return;
    }

    let aiBriefing = responseText;
    try {
      const parsed = JSON.parse(responseText);
      aiBriefing = parsed?.choices?.[0]?.message?.content || responseText;
    } catch {
      // Keep plain text body as-is.
    }

    ctx.status = 200;
    ctx.body = {
      aiBriefing,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      error: "AI proxy route failed",
      details: error instanceof Error ? error.message : String(error),
    };
  }
};

router.get("/rest/info", info);
router.get("/rest/setting", setting);
router.get("/info", info);
router.post("/rest/ai-briefing-proxy", aiBriefingProxy);

const bodyParserBodyLimit = "50mb";
const bodyParser = createBodyParser({
  jsonLimit: bodyParserBodyLimit,
  xmlLimit: bodyParserBodyLimit,
  textLimit: bodyParserBodyLimit,
  formLimit: bodyParserBodyLimit,
});

exports.bodyParser = bodyParser;
