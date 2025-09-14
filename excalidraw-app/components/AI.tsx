import type { ExcalidrawImperativeAPI } from "../../packages/excalidraw/types";
import {
  DiagramToCodePlugin,
  exportToBlob,
  getTextFromElements,
  MIME_TYPES,
  TTDDialog,
} from "../../packages/excalidraw";
import { getDataURL } from "../../packages/excalidraw/data/blob";
import ky from "ky";
import { toast } from "react-toastify";
import { ErrMessage } from "./ErrMessage";
import { textGenerationPrototypePrompt } from "./prompt";

const modelName = import.meta.env.VITE_APP_MODEL_NAME;
const apiKey = import.meta.env.VITE_APP_API_KEY;

export const AIComponents = ({
  excalidrawAPI,
}: {
  excalidrawAPI: ExcalidrawImperativeAPI;
}) => {
  return (
    <>
      <DiagramToCodePlugin
        generate={async ({ frame, children }) => {
          const appState = excalidrawAPI.getAppState();

          const blob = await exportToBlob({
            elements: children,
            appState: {
              ...appState,
              exportBackground: true,
              viewBackgroundColor: appState.viewBackgroundColor,
            },
            exportingFrame: frame,
            files: excalidrawAPI.getFiles(),
            mimeType: MIME_TYPES.jpg,
          });

          const dataURL = await getDataURL(blob);

          const textFromFrameChildren = getTextFromElements(children);

          const json = {
            texts: textFromFrameChildren,
            image: dataURL,
            theme: appState.theme,
          };
          const messages = [
            {
              role: "system",
              content:
                `Generate HTML code based on the wireframe which provided just as a expert web frontend developer.
                Write entire HTML file with TailwindCSS for style, make sure that can be deploy standalone.` +
                "Apply best pratice for it, use `https://placehold.co/` for image placeholder without generate SVG image." +
                `Make sure that work well both on desktop and mobile, add more aesthetics and creativity for the view after proper understanding of prototyping.
                Use a suitable title as well as possible.` +
                "Return the result directly, do not add any other contents, do not wrap in code block with '```' or '```html`." +
                `Input wireframe:<json>
                ${JSON.stringify(json)}
                </json>`,
            },
          ];

          try {
            const response: Response = await ky(
              `${import.meta.env.VITE_APP_API_URL}/v1/chat/completions`,
              {
                method: "POST",
                timeout: 600000,
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${apiKey}`,
                  "User-Agent": "Apifox/1.0.0 (https://apifox.com)",
                },
                body: JSON.stringify({
                  messages,
                  model: modelName || "gpt-4o",
                }),
              },
            );

            const result = await response.json();
            const html = result.choices[0].message.content;
            if (!html) {
              throw new Error("Generation failed (invalid response)");
            }
            return { html };
          } catch (error: any) {
            if (error.response) {
              try {
                const errorData = await error.response.json();

                toast(<ErrMessage err_code={errorData.error.err_code} />, {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
                throw new Error("Generation failed...");
              } catch (parseError) {
                throw new Error("Generation failed...");
              }
            } else {
              throw new Error("Generation failed (invalid response)");
            }
          }
        }}
      />

      <TTDDialog
        onTextSubmit={async (input) => {
          const messages = [
            {
              role: "system",
              content:
                `Generate diagram in mermaid format based on user instruction as a diagram expert.
                Prioritize the generation of flow charts, class diagrams and sequence diagrams as much as possible.` +
                "Return the code directly, do not add any other contents, do not wrap in code block with '```' or '```mermaid'." +
                `The language must be as same as user instruction.
                User instruction:<text>HTTPS协议</text>`,
            },
            { role: "user", content: input },
          ];
          try {
            const response: Response = await ky(
              `${import.meta.env.VITE_APP_API_URL}/v1/chat/completions`,
              {
                method: "POST",
                timeout: 600000,
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${apiKey}`,
                  "User-Agent": "Apifox/1.0.0 (https://apifox.com)",
                },
                body: JSON.stringify({
                  messages,
                  model: modelName || "gpt-4o",
                }),
              },
            );

            const rateLimit = response.headers.has("X-Ratelimit-Limit")
              ? parseInt(response.headers.get("X-Ratelimit-Limit") || "0", 10)
              : undefined;

            const rateLimitRemaining = response.headers.has(
              "X-Ratelimit-Remaining",
            )
              ? parseInt(
                  response.headers.get("X-Ratelimit-Remaining") || "0",
                  10,
                )
              : undefined;

            const json = await response.json();
            if (!response.ok) {
              if (response.status === 429) {
                return {
                  rateLimit,
                  rateLimitRemaining,
                  error: new Error(
                    "Too many requests today, please try again tomorrow!",
                  ),
                };
              }

              throw new Error(json.message || "Generation failed...");
            }

            const responseContent = json.choices[0].message.content;
            // Use regex to strip unnecessary parts (```mermaid and ending ```)
            const generatedResponse = responseContent
              .replace(/^.*```mermaid\n/, "")
              .replace(/\n```$/, "");

            if (!generatedResponse) {
              throw new Error("Generation failed...");
            }
            return { generatedResponse, rateLimit, rateLimitRemaining };
          } catch (err: any) {
            if (err.response) {
              try {
                const errorData = await err.response.json();
                toast(<ErrMessage err_code={errorData.error.err_code} />, {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
                throw new Error("Generation failed...");
              } catch (parseError) {
                throw new Error("Generation failed...");
              }
            } else {
              throw new Error("Request failed");
            }
          }
        }}
        onTextGenerationPrototype={async (input) => {
          try {
            const { prompt_1, prompt_2 } = textGenerationPrototypePrompt();
            const prompt1 = prompt_1 + input;
            const response: Response = await ky(
              `${import.meta.env.VITE_APP_API_URL}/v1/chat/completions`,
              {
                method: "POST",
                timeout: false,
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${apiKey}`,
                  "User-Agent": "Apifox/1.0.0 (https://apifox.com)",
                },
                body: JSON.stringify({
                  messages: [{ role: "user", content: prompt1 }],
                  model: modelName || "gpt-4o",
                }),
              },
            );
            const rateLimit = response.headers.has("X-Ratelimit-Limit")
              ? parseInt(response.headers.get("X-Ratelimit-Limit") || "0", 10)
              : undefined;

            const rateLimitRemaining = response.headers.has(
              "X-Ratelimit-Remaining",
            )
              ? parseInt(
                  response.headers.get("X-Ratelimit-Remaining") || "0",
                  10,
                )
              : undefined;
            const json = await response.json();
            if (!response.ok) {
              if (response.status === 429) {
                return {
                  rateLimit,
                  rateLimitRemaining,
                  error: new Error(
                    "Too many requests today, please try again tomorrow!",
                  ),
                };
              }

              throw new Error(json.message || "Generation failed...");
            }

            const result1 = json.choices[0].message.content;
            const response2: Response = await ky(
              `${import.meta.env.VITE_APP_API_URL}/v1/chat/completions`,
              {
                method: "POST",
                timeout: false,
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${apiKey}`,
                  "User-Agent": "Apifox/1.0.0 (https://apifox.com)",
                },
                body: JSON.stringify({
                  messages: [
                    { role: "user", content: prompt1 },
                    { role: "assistant", content: result1 },
                    { role: "user", content: prompt_2 },
                  ],
                  top_p: 0.5,
                  model: modelName || "gpt-4o",
                }),
              },
            );
            const rateLimit2 = response.headers.has("X-Ratelimit-Limit")
              ? parseInt(response.headers.get("X-Ratelimit-Limit") || "0", 10)
              : undefined;

            const rateLimitRemaining2 = response.headers.has(
              "X-Ratelimit-Remaining",
            )
              ? parseInt(
                  response.headers.get("X-Ratelimit-Remaining") || "0",
                  10,
                )
              : undefined;
            const json2 = await response2.json();
            if (!response.ok) {
              if (response.status === 429) {
                return {
                  rateLimit,
                  rateLimitRemaining,
                  error: new Error(
                    "Too many requests today, please try again tomorrow!",
                  ),
                };
              }

              throw new Error(json.message || "Generation failed...");
            }

            const result2 = json2.choices[0].message.content;
            const generatedResponse = JSON.parse(
              result2.replace(/```json|\```/g, ""),
            );
            return {
              generatedResponse,
              rateLimit: rateLimit2,
              rateLimitRemaining: rateLimitRemaining2,
            };
          } catch (error: any) {
            if (error.response) {
              try {
                const errorData = await error.response.json();
                toast(<ErrMessage err_code={errorData.error.err_code} />, {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
                throw new Error("Generation failed...");
              } catch (parseError) {
                throw new Error("Generation failed...");
              }
            } else {
              throw new Error("Generation failed (invalid response)");
            }
          }
        }}
      />
    </>
  );
};
