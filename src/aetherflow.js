export function render(vdomNode, DOMElement) {
  console.log(vdomNode.tag);
  // Creating a new node based on the tag of the incoming node. First thing that comes in should be something like an h1. Next console.log should be the first child and so on. Lots of [object Objects]
  const newNode = document.createElement(vdomNode.tag);
  // Add that new node to the parent. When this cycles through, the DOMElement will be the parent from before so the first pass adds the h1 to the root, the child gets added to the h1, etc. until all of the children are added to all of the parents.
  DOMElement.appendChild(newNode);

  Object.entries(vdomNode.props).forEach((entry) => {
    const attributeName = entry[0];
    const attributeValue = entry[1];

    // If the attributeName isn't 'children', setAttribute on the new node to the name and value above.
    if (attributeName !== "children") {
      if (attributeName === "style") {
        // here inline styles are applied individually
        // since the `.styles` attribute of DOM elements isn't a regular object, doing something like, `newElement.setAttribute("styles", { color: "red" });` does not work
        Object.entries(attributeValue).forEach(([styleName, styleValue]) => {
          newNode.style[styleName] = styleValue;
        });
      }
      // newNode.setAttribute(attributeName, attributeValue);
      // Qualifier for different attributes  like 'startsWith('on')s

      if (attributeName.startsWith("on")) {
        newNode.addEventListener(
          attributeName.toLowerCase().slice(2),
          attributeValue
        );
      } else if (attributeName === "disabled") {
        if (attributeValue) {
          newNode.setAttribute(attributeName, attributeValue);
        }
      }

      // Otherwise, for each child...
    }
  });

  // This is a boolean, if there are children within vdomNode.props, it continues the logic
  if (vdomNode.props.children) {
    // This sets the children to an array if it isn't already.
    const children = Array.isArray(vdomNode.props.children)
      ? vdomNode.props.children
      : [vdomNode.props.children];

    // Create arrays. attributeName and attributeValue to be added to the nodes
    {
      children.forEach((child) => {
        // If it's a string...
        if (typeof child === "string" || typeof child === "number") {
          console.log("It's a string!");
          console.log(`String: ${child}`);
          // Create a text node with the value of the child.
          const textNode = document.createTextNode(child);
          newNode.appendChild(textNode);
          // Otherwise, for each child...
        } else if (typeof child === "object" && child !== null) {
          console.log("It's an object!");
          console.log(`Object: ${child}`);
          // Render a new node that's an object.
          console.log(`child: ${child}, newNode: ${newNode}`);
          render(child, newNode);
        }
        // Additional type checks can go here
      });
    }
  }
}

// State
