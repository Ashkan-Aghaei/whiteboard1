import ky from "ky";
import type { IContent, Role } from "./indexDB";

interface IParams {
  api_key: string;
  model: string;
  signal: AbortSignal;
  messages: Array<{
    role: Role;
    content: IContent;
  }>;
}

const system = `You are a reliable intelligent conversational assistant. You need to carefully analyze the information in the screenshot images provided by the user and closely integrate it with the user's question to generate a professional, detailed, and reliable response. Ensure that the response fully utilizes the content from the images and maintains consistency with the language used in the user's question. Please pay close attention to the details in the images to provide accurate explanations and suggestions.`;

export const chatApi = async (
  params: IParams,
  onData: (data: string) => void,
  onError: (error: any) => void,
  onComplete: () => void,
) => {
  const { api_key, model = "gpt-4o", messages, signal } = params;

  try {
    const response: Response = await ky(
      `${import.meta.env.VITE_APP_API_URL}/v1/chat/completions`,
      {
        signal,
        method: "POST",
        timeout: false,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${api_key}`,
          "User-Agent": "Apifox/1.0.0 (https://apifox.com)",
        },
        body: JSON.stringify({
          model,
          stream: true,
          messages: [{ role: "system", content: system }, ...messages],
        }),
      },
    );

    if (!response.body) {
      throw new Error("ReadableStream not supported");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6); // Remove 'data: ' prefix
          if (data === "[DONE]") {
            onComplete();
          } else {
            try {
              const parsed = JSON.parse(data);
              if (parsed.choices && parsed.choices[0].delta.content) {
                onData(parsed.choices[0].delta.content);
              }
            } catch (e) {
              console.error("Error parsing JSON:", e);
            }
          }
        }
      }
    }
  } catch (error: any) {
    if (error.response) {
      // 尝试从响应中解析错误信息
      try {
        const errorData = await error.response.json();
        onError(errorData);
      } catch (parseError) {
        onError({ error: parseError });
      }
    } else {
      onError({ error });
    }
  }
};

// 图片上传
export const uploadApi = async (file: File) => {
  const formData = new FormData();
  formData.append("data", file);
  try {
    const response = await fetch(
      `https://upload.302ai.cn/gpt/api/upload/gpt/image`,
      {
        method: "POST",
        body: formData,
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const imageResult = await response.json();
    return imageResult?.data?.url;
  } catch (error) {
    console.error(`Error uploading file ${file.name}:`, error);
    return null;
  }
};
