// Render function that converts elements and DOM node

export function render(root, DOMElement) {
  console.log(root);

  const element = document.createElement(root.tag);

  DOMElement.appendChild(element);


  
  // Check to see if children exist and if so...
  if (root.props.children) {
    // Check if it's a single child or an array of children
    const children = Array.isArray(root.props.children)
      ? // Ternary to check if it's an array. If it is, assign directly to children.
        root.props.children
      : // If it isn't, add it to an array containing root.props.children
        [root.props.children];

    children.forEach((child) => {
      if (typeof child === "string") {
        // If it's a string, create a text node
        const textNode = document.createTextNode(child);
        element.appendChild(textNode);
      } else if (typeof child === "object" && child !== null) {
        // If it's an object and not null, it's an element
        render(child, element);
      }
      // Additional type checks can go here
    });
  }

  // Add children
  // Need to add attributes
  // Need recursion

  //Logic for rerendering
}
