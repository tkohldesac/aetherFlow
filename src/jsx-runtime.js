// this function is what babel uses to interpret the jsx code you write. basically, whatever it returns is the object you'll later need to convert to a DOM element. In other words, it's return value will represent a node in your VDOM
export const jsx = (tag, props) => {
  return { tag, props };
};

export const jsxs = jsx;