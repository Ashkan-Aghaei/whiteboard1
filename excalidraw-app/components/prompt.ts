export const textGenerationPrototypePrompt = () => {
  const prompt_1 = `Design a product prototype as an excellent product manager, write your design plan and layout description based on user input.
Return the result in detail with plain text format.
The layout description must be in detail, include the contents about components, style, behavior and others.
You should add some notes for assist user to understand how do you design it.
User input:`;

  const prompt_2 =
    `Based on the above information, convert your design to a whiteboard with the following JSON schema:` +
    "```typescript" +
    `interface Element {
  type: "rectangle" | "ellipse" | "text" | "arrow" | "line";
  id: string; // unique for each elements
  x: number; // required
  y: number; // required
  width: number;
  height: number;
  backgroundColor?: string; // color, transparent or hex code format
  strokeWidth?: number; // eg. 2
  strokeColor?: string; // color, transparent or hex code format
  "fillStyle"?: "hachure" | "cross-hatch" | "solid" | "zigzag",
  "roughness"?: number;  // eg. 0
  "opacity"?: number;  // eg. 100
  "text"?: string;  // only for type=text
  "fontSize"?: number;  // eg. 16
  "textAlign"?: "left" | "center" | "right";
  "verticalAlign"?: "top" | "middle" | "bottom";
  strokeStyle?: "solid" | "dashed" | "dotted";
  label?: {  // only for type in rectangle, ellipse and arrow
    text: string;
    textAlign?: string,
    verticalAlign?: string,
    fontSize?: number;,
  };
  start?: {id:string};  // only for type=arrow, id of the start element which want to bind
  end?: {id:string};  // only for type=arrow, id of the end element which want to bind
}` +
    "```" +
    `You can follow these suggestions for best practices:
- For user needs description, if the user's input is the general direction of the product (such as "product prototype diagram of online shopping platform"), you need to fill in the text appropriately, enrich the content, and ensure that the content is relevant, logical, and feasible with the direction; If the user's input is a detailed description of the product (such as "an online shopping platform, the mobile application interface includes a homepage, product detail page, shopping cart page, and payment page, where the homepage includes a top navigation bar, slideshow, category navigation, and recommended product area; the product detail page includes..."), you need to generate a corresponding product prototype image based on the user's description, without changing the exact text in the user description.
- You need to define the main color tone, auxiliary color, and background color of the entire product prototype by yourself, with a unified visual style to ensure readability and visual comfort of the content.
- You need to distinguish between text content and background color to ensure sufficient contrast between the text content and background, so that the text can be clearly read and displayed in its entirety. Please use color combinations that meet accessibility standards to enhance user experience and readability.
- keep the layout efficient and expressive as much as possible, only necessary properties for each components
- use rect elements for base layout and components, such as frame, buttons
- use different colors to describe, differentiate the weight of different elements
- use separate text elements as component text part instead of element label text
- Accurately calculate the position and spacing based on the length of the text, and do not overlap or block other elements
- use larger spacing, wide layout for better UI experience
Following is the good examples:
- A single button:
[
    {
        "type": "rectangle",
        "id": "main-container",
        "x": 100,
        "y": 50,
        "width": 200,
        "height": 60,
        "strokeWidth": 2,
        "strokeColor": "#333333",
        "fillStyle": "solid",
        "roughness": 0,
        "opacity": 100
    },
    {
        "type": "text",
        "id": "tab-container",
        "x": 170,
        "y": 70,
        "text":"Button",
        "width": 500,
        "height": 80,
        "strokeWidth": 1,
        "strokeColor": "#333333"
    },
]
- A link with annotation
[
    {
        "type": "text",
        "id": "main-container",
        "x": 100,
        "y": 50,
        "width": 200,
        "height": 60,
        "strokeWidth": 2,
        "strokeColor": "#333333",
        "fillStyle": "solid",
        "roughness": 0,
        "opacity": 100
    },
    {
        "type": "text",
        "id": "tab-container",
        "x": 170,
        "y": 70,
        "text":"Button",
        "width": 500,
        "height": 80,
        "strokeWidth": 1,
        "strokeColor": "#333333"
    },
]` +
    "You must output the result in JSON format, do not add any other contents, do not wrapped in code block with " +
    "```json and ```." +
    `The result is a JSON-array with Element items.`;

  return { prompt_1, prompt_2 };
};
