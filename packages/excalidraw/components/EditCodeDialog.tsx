import { t } from "../i18n";
import { Dialog } from "./Dialog";
import React, { useState } from "react";
import "./EditCodeDialog.scss";
import Editor from "@monaco-editor/react";
import type { ExcalidrawElement, NonDeleted } from "../element/types";

export const EditCodeDialog = ({
  onClose,
  firstSelectedElement,
  onEditFirstSelectedElement,
}: {
  onClose?: () => void;
  firstSelectedElement?: NonDeleted<ExcalidrawElement>;
  onEditFirstSelectedElement: (data: string) => void;
}) => {
  const [tab, setTab] = useState(1);
  const [data, setData] = useState(
    firstSelectedElement?.customData?.generationData?.html,
  );
  const tabList = [
    { value: 1, label: t("editCodeDialog.edit") },
    { value: 2, label: t("editCodeDialog.preview") },
  ];
  const handleClose = React.useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  // console.log(firstSelectedElement);

  return (
    <Dialog
      onCloseRequest={handleClose}
      title={t("editCodeDialog.title")}
      className={"EditCodeDialog"}
    >
      <div className="tab">
        {tabList.map((item) => (
          <div
            style={{ color: tab === item.value ? "#8e47f0" : "" }}
            key={item.value}
            onClick={() => setTab(item.value)}
          >
            {item.label}
          </div>
        ))}
      </div>
      {tab === 1 ? (
        <div>
          <Editor
            height="71vh"
            defaultLanguage="html"
            value={data}
            onChange={(value, en) => {
              setData(value);
              console.log(value);
            }}
          />
        </div>
      ) : (
        <div
          style={{ height: "71vh", overflowY: "auto", minWidth: "50%" }}
          dangerouslySetInnerHTML={{ __html: data }}
        />
      )}
      <div style={{ textAlign: "end" }}>
        <span
          className="save"
          onClick={() => {
            onEditFirstSelectedElement(data);
            handleClose();
          }}
        >
          保存
        </span>
      </div>
    </Dialog>
  );
};
