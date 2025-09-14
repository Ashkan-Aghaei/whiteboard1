const DATA_NAME = "DATA";

export function setLocalStorage(window: Window, objects: any) {
  if (window) {
    let existedData = JSON.parse(
      window.localStorage.getItem(DATA_NAME) || "{}",
    );
    existedData = {
      ...existedData,
      ...objects,
    };
    window.localStorage.setItem(DATA_NAME, JSON.stringify(existedData));
  }
}

export function getLocalStorage(window: Window, key: string) {
  if (window) {
    const data = JSON.parse(window.localStorage.getItem(DATA_NAME) || "{}");
    return data[key];
  }
  return null;
}
