// import { useI18n, getLanguage } from "../../packages/excalidraw/i18n";

import { t, getLanguage } from "../../i18n";

export function ErrMessage(props: { err_code: number; region: number }) {
  const { err_code, region } = props;
  // const { t } = useI18n();
  const relogin = (
    <a
      className="underline"
      style={{ color: "#0070f0" }}
      href="/auth"
      target="_blank"
    >
      {t("errMsg.log_in_again")}
    </a>
  );
  const gw = (
    <a
      className="underline"
      style={{ color: "#0070f0" }}
      href={region ? "https://302.ai/" : "https://302ai.cn/"}
      target="_blank"
      rel="noreferrer"
    >
      302.AI
    </a>
  );
  switch (err_code) {
    case -10001:
      return (
        <div className="font-bold">
          {t("errMsg.lost_voucher")} {relogin}
          {getLanguage().code === "ja-JP" && "してください。"}
        </div>
      );
    case -10002:
      return (
        <div className="font-bold">
          {t("errMsg.tool_disabled")} {gw}{" "}
          {getLanguage().code === "ja-JP"
            ? "をご参照ください。"
            : getLanguage().code === "en"
            ? "for details."
            : ""}
        </div>
      );
    case -10003:
      return <div className="font-bold">{t("errMsg.network_err")}</div>;
    case -10004:
      return (
        <div className="font-bold">
          {t("errMsg.balance_not")} {gw}{" "}
          {getLanguage().code === "ja-JP"
            ? "をご覧ください"
            : getLanguage().code === "en"
            ? "to create your own tools."
            : ""}
        </div>
      );
    case -10005:
      return (
        <div className="font-bold">
          {t("errMsg.voucher_expiration")} {relogin}{" "}
          {getLanguage().code === "ja-JP" && "してください。"}
        </div>
      );
    case -10006:
      return (
        <div className="font-bold">
          {t("errMsg.limit_upper_limit")} {gw}{" "}
          {getLanguage().code === "ja-JP"
            ? "をご参照ください。"
            : getLanguage().code === "en"
            ? "for details."
            : ""}
        </div>
      );
    case -10007:
      return (
        <div className="font-bold">
          {t("errMsg.daily_limit_limit")} {gw}{" "}
          {getLanguage().code === "ja-JP"
            ? "をご参照ください。"
            : getLanguage().code === "en"
            ? "for details."
            : ""}
        </div>
      );
    case -10008:
      return (
        <div className="font-bold">
          {t("errMsg.useless_channel")} {gw}{" "}
          {getLanguage().code === "ja-JP"
            ? "をご参照ください。"
            : getLanguage().code === "en"
            ? "for details."
            : ""}
        </div>
      );
    case -10009:
      return (
        <div className="font-bold">
          {t("errMsg.api_not_support")} {gw}{" "}
          {getLanguage().code === "ja-JP"
            ? "をご参照ください。"
            : getLanguage().code === "en"
            ? "for details."
            : ""}
        </div>
      );
    case -10012:
      return (
        <div className="font-bold">
          {t("errMsg.maximum_hourly_limit_prefix")} {gw}{" "}
          {t("errMsg.maximum_hourly_limit_suffix")}
        </div>
      );
    case -10018:
      return (
        <div className="font-bold">
          {t(
            "errMsg.Monthly_Quota_reached_maximum_limit_for_details_please_visit_302_AI",
          )}{" "}
          {gw}
        </div>
      );
    case -1024:
      return (
        <div className="font-bold">
          {t("errMsg.connection_timed_out")} {gw}{" "}
          {getLanguage().code === "ja-JP" && "に連絡してください。"}
        </div>
      );
    default:
      return (
        <div className="font-bold">
          {t("errMsg.unknown_error")} {gw}{" "}
          {getLanguage().code === "ja-JP"
            ? "をご参照ください。"
            : getLanguage().code === "en"
            ? "for details."
            : ""}
        </div>
      );
  }
}
