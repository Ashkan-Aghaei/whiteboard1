import "./index.scss";
import { t } from "../../i18n";
import { chatApi } from "./service";
import { v4 as uuidV4 } from "uuid";
import { toast } from "react-toastify";
import { IoMdSend } from "react-icons/io";
import { ErrMessage } from "./ErrMessage";
import SelectionArea from "./SelectionArea";
import { FaRegCopy } from "react-icons/fa6";
import { BiLoaderAlt } from "react-icons/bi";
import { MarkdownViewer } from "./MarkdownViewer";
import { FaRegCircleUser } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useExcalidrawSetAppState } from "../App";
import { useUIAppState } from "../../context/ui-appState";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import type { ChangeEvent } from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import type { IChat, IContent, Role } from "./indexDB";
import {
  addChatData,
  clearAllChatData,
  deleteChatData,
  getChatData,
} from "./indexDB";

const apiKey = import.meta.env.VITE_APP_API_KEY;
const modelName = import.meta.env.VITE_APP_MODEL_NAME;
const region = import.meta.env.VITE_APP_REGION;

export const ChatMenu = () => {
  const appState = useUIAppState();
  const setAppState = useExcalidrawSetAppState();

  const footRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const abortControllersRef = useRef<AbortController | null>(null);

  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<IChat[]>([]);
  const [isDistinguish, setIsDistinguish] = useState(false);
  const [contentHeight, setContentHeight] = useState("100%");
  const [showSelectionArea, setShowSelectionArea] = useState(false);

  const updateContentHeight = useCallback(() => {
    if (footRef.current) {
      const footHeight = footRef.current.offsetHeight;
      setContentHeight(`calc(100vh - ${footHeight + 121}px - 20px)`); // 20px for gap
    }
  }, []);

  useEffect(() => {
    getChatData().then((res) => {
      setMessages(res);
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  useEffect(() => {
    updateContentHeight();
    window.addEventListener("resize", updateContentHeight);
    return () => window.removeEventListener("resize", updateContentHeight);
  }, [updateContentHeight]);

  useEffect(() => {
    if (appState?.isDeleteChatData) {
      onDelete();
    }
  }, [appState?.isDeleteChatData]);

  useEffect(() => {
    updateContentHeight();
  }, [inputValue, updateContentHeight]);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleScreenshotTaken = async (base64: string) => {
    scrollToBottom();
    if (!apiKey) {
      toast.error(t("Apikey_does_not_exist"));
      return;
    }
    const inputValueText = messages[messages.length - 2].askText;
    const content: IContent = [{ type: "text", text: inputValueText }];
    if (base64) {
      content.push({
        type: "image_url",
        image_url: { url: base64 },
      });
    }
    const message: Array<{ role: Role; content: IContent }> = messages
      .filter((f, index) => index < messages.length - 2)
      .map((item) => ({
        role: item.role,
        content: [{ type: "text", text: item.askText }],
      }));
    message.push({ role: "user", content });
    const assistantData = messages[messages.length - 1];
    const abortController = new AbortController();
    abortControllersRef.current = abortController;
    chatApi(
      {
        api_key: apiKey,
        messages: message,
        model: modelName,
        signal: abortController.signal,
      },
      (data) => {
        assistantData.askText += data;
        setMessages((v) => {
          return v.map((item) => {
            if (item.uid !== assistantData.uid) {
              return item;
            }
            return { ...assistantData };
          });
        });
      },
      async (error) => {
        if (error.error?.name !== "AbortError") {
          toast(<ErrMessage err_code={error.error.err_code} region={region} />);
        }
        const chatData = await getChatData();
        setMessages(chatData);
        setShowSelectionArea(false);
      },
      async () => {
        await addChatData({ ...assistantData, status: "done" });
        const chatData = await getChatData();
        setMessages(chatData);
        setShowSelectionArea(false);
      },
    );
  };

  const onDelete = async (id?: number) => {
    if (id) {
      await deleteChatData(id);
    } else {
      await clearAllChatData();
    }
    const chatData = await getChatData();
    setMessages(chatData);
    setAppState({ isDeleteChatData: false });
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`;
    }
  };

  const onSendChat = async () => {
    if (showSelectionArea) {
      return;
    }
    if (!inputValue.trim()) {
      toast.error(t("SendChatTips"));
      return;
    }
    const uid = uuidV4();
    const role: Role = "user";
    const params: IChat = { uid, role, askText: inputValue, status: "done" };
    await addChatData(params);
    const assistantData: IChat = {
      role: "assistant" as Role,
      uid: uuidV4(),
      askText: "",
      status: "perform",
    };
    setMessages((v) => [...v, { ...params }, { ...assistantData }]);
    setInputValue("");
    setShowSelectionArea(true);
  };

  const onCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast(t("copyTextOk"));
      },
      (err) => {
        toast(t("copyTextError"));
      },
    );
  };

  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="box">
      <div
        className="content"
        ref={contentRef}
        style={{ height: contentHeight }}
      >
        {messages.map((item) => (
          <div
            className="chatBox"
            key={item.uid}
            style={{ marginLeft: item.role === "user" ? "20%" : 0 }}
          >
            {item.role === "assistant" && <img src="/logo.png" alt="" />}
            {item.status === "done" || item?.askText ? (
              <div style={{ width: "100%" }}>
                <MarkdownViewer className="text" content={item?.askText} />
                <div
                  className="chatBoxtAction"
                  style={
                    showSelectionArea && item.status !== "done"
                      ? { opacity: 0 }
                      : {}
                  }
                >
                  <FaRegCopy
                    style={{ color: "#8e47f0", cursor: "pointer" }}
                    onClick={() => onCopy(item.askText)}
                  />
                  <RiDeleteBin6Line
                    style={{ color: "red", cursor: "pointer" }}
                    onClick={() => onDelete(item.id)}
                  />
                </div>
              </div>
            ) : (
              <BiLoaderAlt className="animate-spin" />
            )}
            {item.role === "user" && <FaRegCircleUser className="userIcon" />}
          </div>
        ))}
      </div>
      <div className="foot" ref={footRef}>
        <div className="inputStyle">
          <textarea
            ref={textareaRef}
            value={inputValue}
            placeholder={t("chatInputPlaceholder")}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                !e.nativeEvent.isComposing
              ) {
                e.preventDefault();
                onSendChat();
              }
            }}
          />
          {showSelectionArea ? (
            <MdOutlineCheckBoxOutlineBlank
              onClick={() => abortControllersRef?.current?.abort()}
              className="IoMdSend"
              style={{ color: "red" }}
            />
          ) : (
            <IoMdSend className="IoMdSend" onClick={onSendChat} />
          )}
        </div>
      </div>
      <SelectionArea
        isDistinguish={isDistinguish}
        showSelectionArea={showSelectionArea}
        onScreenshot={handleScreenshotTaken}
      />
    </div>
  );
};
