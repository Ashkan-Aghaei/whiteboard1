import { getLanguage } from "../../packages/excalidraw/i18n";
const cnUrl = import.meta.env.VITE_APP_OFFICIAL_WEBSITE_URL_CHINA;
const enUrl = import.meta.env.VITE_APP_OFFICIAL_WEBSITE_URL_GLOBAL;
const region = import.meta.env.VITE_APP_REGION;

export function ErrMessage(err_code: any) {
  const code = getLanguage().code;
  const langs = ["zh-CN", "en", "ja-JP"];
  const language = langs.includes(code) ? code : "en";
  return errorCode(err_code)[language as "zh-CN" | "en" | "ja-JP"];
}

const errorCode = (err_code: number) => {
  const href = region ? enUrl : cnUrl;
  const gw = (
    <a
      className="underline"
      style={{ color: "#0070f0" }}
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      302 AI
    </a>
  );
  const relogin = (txt: string) => (
    <a
      className="underline"
      style={{ color: "#0070f0" }}
      href="/auth"
      target="_blank"
    >
      {txt}
    </a>
  );
  switch (+err_code) {
    case -10001:
      return {
        "zh-CN": <div className="font-bold">缺少 302 API 密钥</div>,
        en: <div className="font-bold">Missing 302 Apikey</div>,
        "ja-JP": <div className="font-bold">302 APIキーがありません</div>,
      };
    case -10002:
      return {
        "zh-CN": (
          <div className="font-bold">该工具已禁用/删除，更多请访问 {gw}</div>
        ),
        en: (
          <div className="font-bold">
            This tool has been disabled/deleted, for details please view {gw}
          </div>
        ),
        "ja-JP": (
          <div className="font-bold">
            このツールは無効化/削除されています。詳細は {gw} をご覧ください。
          </div>
        ),
      };
    case -10003:
      return {
        "zh-CN": <div className="font-bold">网络错误，请稍后重试</div>,
        en: (
          <div className="font-bold">Network error, please try again later</div>
        ),
        "ja-JP": (
          <div className="font-bold">
            ネットワークエラー、後でもう一度お試しください。{" "}
          </div>
        ),
      };
    case -10004:
      return {
        "zh-CN": (
          <div className="font-bold">
            账户余额不足，创建属于自己的工具，更多请访问 {gw}
          </div>
        ),
        en: (
          <div className="font-bold">
            Insufficient account balance. Create your own tool, for details
            please view {gw}
          </div>
        ),
        "ja-JP": (
          <div className="font-bold">
            アカウント残高が不足しています。独自のツールを作成するには、 {gw}{" "}
            をご覧ください。
          </div>
        ),
      };
    case -10005:
      return {
        "zh-CN": (
          <div className="font-bold">账户凭证过期，{relogin("请重新登录")}</div>
        ),
        en: (
          <div className="font-bold">
            Account credential expired, {relogin("please log in again")}
          </div>
        ),
        "ja-JP": (
          <div className="font-bold">
            アカウントの資格情報が期限切れです。
            {relogin("再度ログインしてください")}。{" "}
          </div>
        ),
      };
    case -10006:
      return {
        "zh-CN": (
          <div className="font-bold">账户总额度已达上限，更多请访问 {gw}</div>
        ),
        en: (
          <div className="font-bold">
            Total Quota reached maximum limit, for details please view {gw}
          </div>
        ),
        "ja-JP": (
          <div className="font-bold">
            アカウントの総限度額に達しました。詳細は {gw} をご覧ください。
          </div>
        ),
      };
    case -10007:
      return {
        "zh-CN": (
          <div className="font-bold">账户日额度已达上限，更多请访问 {gw}</div>
        ),
        en: (
          <div className="font-bold">
            Daily Quota reached maximum limit, for details please view {gw}
          </div>
        ),
        "ja-JP": (
          <div className="font-bold">
            アカウントの日次限度額に達しました。詳細は {gw} をご覧ください。
          </div>
        ),
      };
    case -10008:
      return {
        "zh-CN": (
          <div className="font-bold">当前无可用通道，更多请访问 {gw}</div>
        ),
        en: (
          <div className="font-bold">
            No available channels currently, for details please view {gw}
          </div>
        ),
        "ja-JP": (
          <div className="font-bold">
            現在利用可能なチャネルはありません。詳細は {gw} をご覧ください。
          </div>
        ),
      };
    case -10009:
      return {
        "zh-CN": (
          <div className="font-bold">不支持当前API功能，更多请访问 {gw}</div>
        ),
        en: (
          <div className="font-bold">
            Current API function not supported, for details please view {gw}
          </div>
        ),
        "ja-JP": (
          <div className="font-bold">
            現在のAPI機能はサポートされていません。詳細は {gw} をご覧ください。{" "}
          </div>
        ),
      };
    case -10010:
      return {
        "zh-CN": <div className="font-bold">未能找到资源，更多请访问 {gw}</div>,
        en: (
          <div className="font-bold">
            Resource not found, for details please view {gw}
          </div>
        ),
        "ja-JP": (
          <div className="font-bold">
            リソースが見つかりませんでした。詳細は {gw} をご覧ください。{" "}
          </div>
        ),
      };
    case -10011:
      return {
        "zh-CN": <div className="font-bold">无效的请求</div>,
        en: <div className="font-bold">Invalid request</div>,
        "ja-JP": <div className="font-bold">無効なリクエスト</div>,
      };
    case -10012:
      return {
        "zh-CN": (
          <div className="font-bold">
            该免费工具在本小时的额度已达上限,请访问 {gw} 生成属于自己的工具
          </div>
        ),
        en: (
          <div className="font-bold">
            This free tool's hour quota reached maximum limit. Please view {gw}{" "}
            to create your own tool
          </div>
        ),
        "ja-JP": (
          <div className="font-bold">
            この無料ツールは今時間の上限に達しました。{gw}{" "}
            を訪問して自分のツールを作成してください
          </div>
        ),
      };
    case -10018:
      return {
        "zh-CN": (
          <div className="font-bold">账户月额度已达上限，更多请访问 {gw}</div>
        ),
        en: (
          <div className="font-bold">
            Monthly Quota reached maximum limit, for details please visit {gw}
          </div>
        ),
        "ja-JP": (
          <div className="font-bold">
            アカウントの月次限度額に達しました。詳細は {gw} をご覧ください
          </div>
        ),
      };
    case -1024:
      return {
        "zh-CN": (
          <div className="font-bold">
            AI接口连接超时，请稍后重试或者联系 {gw}
          </div>
        ),
        en: (
          <div className="font-bold">
            AI interface connection timeout, please try again later or contact{" "}
            {gw}
          </div>
        ),
        "ja-JP": (
          <div className="font-bold">
            AIインターフェース接続がタイムアウトしました。しばらくしてから再試行するか、
            {gw} に連絡してください。{" "}
          </div>
        ),
      };
    default:
      return {
        "zh-CN": <div className="font-bold">未知错误，更多请访问 {gw}</div>,
        en: (
          <div className="font-bold">
            Unknown error, for details please view {gw}
          </div>
        ),
        "ja-JP": (
          <div className="font-bold">
            不明なエラー、詳細は {gw} をご覧ください。
          </div>
        ),
      };
  }
};
