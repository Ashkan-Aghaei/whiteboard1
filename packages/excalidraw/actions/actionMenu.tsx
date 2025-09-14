import {
  HamburgerMenuIcon,
  HelpIconThin,
  palette,
  tipsIcon,
} from "../components/icons";
import { ToolButton } from "../components/ToolButton";
import { t } from "../i18n";
import { showSelectedShapeActions, getNonDeletedElements } from "../element";
import { register } from "./register";
import { KEYS } from "../keys";
import { StoreAction } from "../store";

export const actionToggleCanvasMenu = register({
  name: "toggleCanvasMenu",
  label: "buttons.menu",
  trackEvent: { category: "menu" },
  perform: (_, appState) => ({
    appState: {
      ...appState,
      openMenu: appState.openMenu === "canvas" ? null : "canvas",
    },
    storeAction: StoreAction.NONE,
  }),
  PanelComponent: ({ appState, updateData }) => (
    <ToolButton
      type="button"
      icon={HamburgerMenuIcon}
      aria-label={t("buttons.menu")}
      onClick={updateData}
      selected={appState.openMenu === "canvas"}
    />
  ),
});

export const actionToggleEditMenu = register({
  name: "toggleEditMenu",
  label: "buttons.edit",
  trackEvent: { category: "menu" },
  perform: (_elements, appState) => ({
    appState: {
      ...appState,
      openMenu: appState.openMenu === "shape" ? null : "shape",
    },
    storeAction: StoreAction.NONE,
  }),
  PanelComponent: ({ elements, appState, updateData }) => (
    <ToolButton
      visible={showSelectedShapeActions(
        appState,
        getNonDeletedElements(elements),
      )}
      type="button"
      icon={palette}
      aria-label={t("buttons.edit")}
      onClick={updateData}
      selected={appState.openMenu === "shape"}
    />
  ),
});

export const actionShortcuts = register({
  name: "toggleShortcuts",
  label: "welcomeScreen.defaults.helpHint",
  icon: HelpIconThin,
  viewMode: true,
  trackEvent: { category: "menu", action: "toggleHelpDialog" },
  perform: (_elements, appState, _, { focusContainer }) => {
    if (appState.openDialog?.name === "help") {
      focusContainer();
    }
    return {
      appState: {
        ...appState,
        openDialog:
          appState.openDialog?.name === "help"
            ? null
            : {
                name: "help",
              },
      },
      storeAction: StoreAction.NONE,
    };
  },
  keyTest: (event) => event.key === KEYS.QUESTION_MARK,
});

export const tipsInfo = register({
  name: "toggleShortcutsTipsInfo",
  label: "welcomeScreen.defaults.tipsInfo",
  icon: tipsIcon,
  viewMode: true,
  trackEvent: { category: "menu", action: "toggleTipsDialog" },
  perform: (_elements, appState, _, { focusContainer }) => {
    if (appState.openDialog?.name === "tips") {
      focusContainer();
    }
    return {
      appState: {
        ...appState,
        openDialog:
          appState.openDialog?.name === "tips"
            ? null
            : {
                name: "tips",
              },
      },
      storeAction: StoreAction.NONE,
    };
  },
  keyTest: (event) => event.key === KEYS.QUESTION_MARK,
});

export const editCode = register({
  name: "toggleShortcutsEditCode",
  label: "welcomeScreen.defaults.editCode",
  icon: tipsIcon,
  viewMode: true,
  trackEvent: { category: "menu", action: "toggleEditCodeDialog" },
  perform: (_elements, appState, _, { focusContainer }) => {
    if (appState.openDialog?.name === "code") {
      focusContainer();
    }
    return {
      appState: {
        ...appState,
        openDialog:
          appState.openDialog?.name === "code"
            ? null
            : {
                name: "code",
              },
      },
      storeAction: StoreAction.NONE,
    };
  },
  keyTest: (event) => event.key === KEYS.QUESTION_MARK,
});
