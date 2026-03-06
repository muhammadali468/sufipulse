import createDOMPurify from "dompurify";
import {JSDOM} from "jsdom"

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

export const sanitizeInput = (obj) => {
  const sanitizedObj = {};
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      sanitizedObj[key] = DOMPurify.sanitize(obj[key]);
    } else {
      sanitizedObj[key] = obj[key];
    }
  }
  return sanitizedObj;
};