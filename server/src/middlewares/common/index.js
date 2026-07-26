Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyParser = exports.commonRouter = void 0;

const Router = require("@koa/router").default;
const bodyParser = require("koa-bodyparser");
const emsStagingRouter = require("../ems-staging").router;
const router = new Router();

function info(context) {
	context.body = process.env.NODE_ENV === "development"
		? require("../../../../client/jimu-core/version.json")
		: require("../../../version.json");
}

function setting(context) {
	context.body = require("../../../../setting.json");
}

router.get("/rest/info", info);
router.get("/rest/setting", setting);
router.get("/info", info);
router.use(emsStagingRouter.routes(), emsStagingRouter.allowedMethods());

exports.commonRouter = router;
exports.bodyParser = bodyParser({
	jsonLimit: "50mb",
	xmlLimit: "50mb",
	textLimit: "50mb",
	formLimit: "50mb",
});