// Variable to keep track of what index the most recently created state is and set it equal to the first index.
let currentStateIndex = 0;
// We won't use this until later but it is the single source of truth for state.
let stateStore = [];

// Keeps track of the root VDOM node and annchor DOM element to render it in. Used for re-rendering
let roots = null;

export function render(vdomNode, DOMElement) {
  // The following sets roots to the vdomNode and DOMElement coming in if roots is null. It's only ever set once because obviously the second+ time roots isn't null.
  if (!roots) roots = [vdomNode, DOMElement];

  // If the type of the VDOM node is a function,
  if (typeof vdomNode.tag === "function") {
    // Create a new node equal to the vdomNode.tag(vdomNode.props);
    const freshVdomNode = vdomNode.tag(vdomNode.props);
    render(freshVdomNode, DOMElement);
  } else {
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
}

// This rerenders stuff.
function rerender() {
  // Takes the new root and sets it to a blank slate before re-rendering everything.
  roots[1].innerHTML = "";

  // State is set to the first index
  currentStateIndex = 0;
  // Now render but instead of dom elements and vdom nodes, start with the new root
  render(roots[0], roots[1]);

  stateStore = stateStore.slice(0, currentStateIndex);
}

// This makes state work
export function makeState(initialValue) {
  // New const for 'thisStateIndex' to be used later, set it to the 'currentStateIndex; and increase currentStateIndex by 1.
  const thisStateIndex = currentStateIndex;
  currentStateIndex++;
  // if stateStore's index is undefined, set it to the initialValue. So when makeState is called, it sets the stateStore[thisStateIndex] equal the initialValue. stateStore stores the state, and [thisStateIndex], defined above, should be the currentStateIndex+1 as increased above.
  if (stateStore[thisStateIndex] === undefined)
    stateStore[thisStateIndex] = initialValue;
  // To describe what happens here, the state's index changes, allowing all the changes to exist alongside all the original data in the other index.

  // This updates the state:
  // This function takes a newValue...
  function updater(newValue) {
    // if the stateStore[thisStateIndex] isn't the newValue...
    if (stateStore[thisStateIndex] !== newValue) {
      // It changes it to the new value...
      stateStore[thisStateIndex] = newValue;
      // And then rerenders with the new value.
      rerender();
    }
  }
  // Once all of this is done, it returns the stateStore[thisStateIndex], which should be updated to the initialValue, and the updater, which should return the new value.
  return [stateStore[thisStateIndex], updater];
}

// Functions that return JSX
// State
