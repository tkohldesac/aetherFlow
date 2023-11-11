<format>tutorial</format>

<tutorial_step>
# Rendering frameworks

<span class="action">You can start with this tutorial and dive right into making your own framework, but some things may make less sense without context. Check out the **Overview** lesson in this unit for all the context you'll need.</span>

This unit's project is to build your own rendering framework from scratch. In the process you'll learn what responsibilities rendering frameworks have in general, where they fit into your stack, and why some of their common code patterns are so common.

<span class="action">To get started, clone the boiler plate and the kanban board for this project.</span>

<clone_board>
<board_id>making-a-rendering-framework</board_id>
</clone_board>

<copyable>
```shell
https://github.com/devyourself-boiler-plates/basic-rendering-framework.git
```
</copyable>

This constitutes doing the first ticket for on the board titled "Clone the boilerplate".

</tutorial_step>

<tutorial_step>
# Background before diving in

You're going to be writing a client side rendering framework that uses a **Virtual DOM**. This means you'll be writing a set of functions that allow your framework's users to write JSX to create stateful, dynamic websites.

Here's a diagram to begin demystifying that transformation:

![JSX to DOM](https://drive.google.com/uc?export=view&id=1Z0hBK6MRGSF2mYtEyDSlr7VTcGd1VSXc)

Babel will parse the JSX but you'll have to define how to take that parsed information and make VDOM nodes out of it.

Also, you'll need to define a function that manipulates the DOM to reflect the information in the VDOM.

And finally you'll need to add some functionality to allow users to create state, or variables that can influence the VDOM and instigate rerendering. This piece is critical to all interactivity

</tutorial_step>

<tutorial_step>
# Install and configure Babel

This ticket is what is going to allow you to use JSX in your code. The alternative is forcing users of your framework to write out Javascript objects that represent virtual DOM nodes themselves. That's a non starter.

<span class="action">Install the following packages in your project.</span>

<copyable>
```shell
npm install @babel/cli
npm install @babel/core
npm install @babel/core
npm install @babel/preset-react
npm install babel-loader
```
</copyable>

<span class="action">Set up a `.babelrc` file in your root directory, then paste the following into it.</span>

<copyable>
```json
{
  "presets": [
    [
      "@babel/preset-react",
      { "runtime": "automatic", "importSource": ".."}
    ]
  ]
}
```
</copyable>

<span class="action">Finally, tell webpack to use babel to parse JSX as it's bundling by pasting the following into the `rules` array under the `module` section of the `webpack.config.js` file.</span>

<copyable>
```javascript
{
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  use: "babel-loader",
}
```
</copyable>

</tutorial_step>

<tutorial_step>
# Tell Babel how to interpret JSX

Parsing JSX is Babel's job, specifically the `@babel/preset-react` library's job. But it only does so much. It can read JSX convert it to the various pieces of information being conveyed by the syntax, but it has no idea what to do with them.

In order to know what to do with the parsed information, Babel relies on a file called `jsx-runtime.js`. This is just a rule about how Babel and the various babel plugins that you've installed to parse JSX work.

Your `.babelrc` file then tell's Babel where to look for that file. That's the part where you wrote `"importSource": ".."`.

Why is this pointing out a directory though? Well, that's circumstantial based on the directory structure of this project. If you look at the webpack config, the entry point is in the `exampleApp` directory, so relative to the entry point the `jsx-runtime.js` file is in the outer directory. That's why.

<span class="action">Add a few lines of code to the `jsx` function in the `jsx-runtime.js` file that meets the specs on the ticket.</span>

<q_a>
<question>
Need a hint?
</question>
<answer>
The function should be returning an object that looks like this: `{ tag, props }`.
</answer>
</q_a>

<q_a>
<question>
Stuck? Need an example solution?
</question>
<answer>
Your `jsx-runtime.js` file should look like this at this point:

<copyable>

```javascript
export const jsx = (tag, props) => {
  return { tag, props };
};

export const jsxs = jsx;
```
</copyable>

Not much to it, but try to conceptualize what this is doing. Babel is going to invoke this function any time it parses JSX. You won't need to do anything else with this file/function.
</answer>
</q_a>
</tutorial_step>

<tutorial_step>
# Write a basic render function

You're already generating VDOM nodes. The next step is manipulating the DOM to reflect all what the user of your framework wrote out in JSX.

To achieve this you're going to write a function called `render` in your `framework.js` file.

Your render function must meet the specs in the ticket titled "Write a basic render function."

This function should be recursively create DOM elements and attach them to the DOM such that the DOM reflects the structure of the VDOM.

<q_a>
<question>
How to create a DOM element of the correct tag type:
</question>
<answer>
Your VDOM nodes have a `tag` key on them, as specified by the `jsx` function in `jsx-runtime.js`. Use it to your advantage, something like this.

```javascript
function render(vdomNode, anchorElement) {
  ...
  const newElement = document.createElement(vdomNode.tag);
  ...
}
```
</answer>
</q_a>

<q_a>
<question>
How to append the newly created element to the anchor element:
</question>
<answer>
Each time your `render` function is called, it created a new DOM element. And, each time it is called it is passed an element as an argument is supposed to be the parent of the new element that `render` creates. Like this:

```javascript
function render(vdomNode, anchorElement) {
  ...
  const newElement = // something here
  ...
  anchorElement.appendChild(newElement);
  ...
}
```
</answer>
</q_a>

<q_a>
<question>
How to render an array of children:
</question>
<answer>
`render` needs to call itself once it's created a new element and attached it to the DOM. In fact it needs to for each of the children of the VDOM node that it received as an argument.

```javascript
function render(vdomNode, anchorElement) {
  ...
  const newElement = // something here
  ...
  if (Array.isArray(vdomNode.props.children)) {
    vdomNode.props.children.forEach(childVdomNode => render(childVdomNode, newElement));
  }
  ...
}
```
</answer>
</q_a>

<q_a>
<question>
How to render a single children:
</question>
<answer>
Treating an array of children and a single child the same will cause errors. So, you'll want to adjust what you did for multiple children for when the `children` prop is not an array.

```javascript
function render(vdomNode, anchorElement) {
  ...
  const newElement = // something here
  ...
  if (!Array.isArray(vdomNode.props.children)) {
    render(vdomNode.props.children, newElement);
  }
  ...
}
```
</answer>
</q_a>

<q_a>
<question>
How to render VDOM nodes which are strings or numbers:
</question>
<answer>
Sometimes a VDOM node isn't even an object. this happens when the JSX looks something like this:

```javascript
<p>Hello World!</p>
```

The paragraph tag's (`<p>`) VDOM node is an object, but its children's VDOM node, which is just the string inside, is not. In cases like this, when a VDOM node is a string or number there is something you should keep in mind: You are at a leaf node in the tree.

So, this is the case then render should **NOT** call itself. Also, the type of DOM element you want to create no longer has a tag. For cases like you want to create something called a `textNode`.

```javascript
function render(vdomNode, anchorElement) {
  ...
  if (typeof vdomNode === "string" || typeof vdomNode === "number") {
    const newElement = document.createTextNode(vdomNode);
  }
  ...
}
```
</answer>
</q_a>

<q_a>
<question>
How to apply props other than the `children` prop as attributes:
</question>
<answer>
There's been no mention of the other props attached to your VDOM nodes so far. These represent attributes of the DOM elements render will create with them. You need to loop over them and apply each on to the newly created DOM element individually.

```javascript
function render(vdomNode, anchorElement) {
  ...
  const newElement = // something here
  ...
  Object.entries(vdomNode.props).forEach((entry) => {
    const attributeName = entry[0];
    const attributeValue = entry[1];
    if (attributeName !== "children") {
      child.setAttribute(attributeName, attributeValue);
    }
  });
  ...
}
```
</answer>
</q_a>
</tutorial_step>

<tutorial_step>
# Test rendering static JSX

Just like the ticket says, it's important to be able to test this work at this juncture. You've so far written a enough to both translate JSX and to render DOM elements based on it.

To what you've done you should add a little code to the `index.js` file in the `exampleApp` directory of your project.

<span class="action">In it should should make a new variable called `vdom`, which you should assign a value of some JSX code.</span>

<span class="action">Also, import your render function and call it with appropriate arguments, like in the specs in the ticket.</span>

When you've written your code, run the following command.

<copyable>
```shell
npm start
```
</copyable>

It will use webpack, with a couple of plugins which are already configured in your `webpack.config.js` file.

This will automatically open a web browser to a page with your `index.html` file and your bundled javascript running in it.

At this point you should see things rendering which reflect the JSX you wrote.

<q_a>
<question>
Need help writing JSX?
</question>
<answer>
It's a lot like HTML, but you can used curly braces (`{}`) to escape the markup language and write javascript. Here's an example that uses these escape characters and gives at least one VDOM node props (non-children props) to test your code with.

```javascript
const x = 6%3;

const vdom = <div>
  <p>Score = {x}</p>
  <button disabled={true}>click me</button>
</div>
```
</answer>
</q_a>

<q_a>
<question>
"I wrote my `render` function but I'm not sure how to use it here."
</question>
<answer>
Your `render` function needs two arguments. The first is a VDOM node, which you defined as JSX with the `vdom` variable. The second is an element already on the DOM to attach your newly rendered DOM elements to as `render` creates them. In this case you'll use the div with id of `"root"`.

```javascript
const rootElement = document.getElementById("root");
```
</answer>
</q_a>

</tutorial_step>

<tutorial_step>
# Handling event listeners

Your JSX is a declarative way to express what you want to render ong the DOM, but the way that event listener register callbacks on the DOM is intrinsically imperative. A.k.a. The `addEventListener` method on DOM elements, isn't exactly something you can take advantage of in JSX (for multiple reasons).

Your render function should use that method to add event listeners when applicable, but when is that? Well, you need to design a way to do it, and the ticket associated with this step lays out a way.

To reiterate what's on the ticket. You should apply attributes that begin with the substring `on` differently than you're applying other attributes.

Instead of simply applying a new attribute, you should invoke the `addEventListener` method, using the rest of the property name as the event type (or the lower cased version of it), and assume that the value of the prop is a callback which you are meant to register to that event type on the newly created element.

<q_a>
<question>
Solution to check your work against:
</question>
<answer>
<copyable>

```javascript

function render(vdomNode, anchorElement) {
  ...
  const newElement = // something here
  ...
  if (attributeName.startsWith("on")) {
    newElement.addEventListener(attributeName.toLowerCase().slice(2), attributeValue);
  }
  ...
};
```
</copyable>
</answer>
</q_a>
</tutorial_step>

<tutorial_step>
# Handling inline styles

Similarly to event listeners, inline styles can't be applied like most normal attributes.

The reason for this in short is that the `.styles` attribute of DOM elements is a special type of object, which you can update parts of but cannot replace all in one swoop as easily.

So, when you specify inline styles as an object in your JSX like this,

```javascript
<div styles={{ borderRadius: "10px", backgroundColor: "blue" }}>
  This is a blue, rounded rectangle
</div>
```

And your render function applies this object as the styles attribute on a DOM element it's generating something like this,

```javascript
newElement.setAttribute(attributeName, attributeValue);
```

It simply wont work.

Instead, you need to loop over each individual style you're trying to apply and set those key value pairs on the element's `styles` key. You've done this kind of thing before with direct DOM manipulation when you've written code like this,

```javascript
domElement.styles.color = "green";
```

Simply do the name for each entry of the `styles` prop of your VDOM nodes within the section of your render function responsible for applying attributes.


<q_a>
<question>
Hint
</question>
<answer>
You're already looping over an object's entries once to apply all the non-children props as attributes. Now, you have a special case where you need to do that same thing, nested within the code you already have, under specific conditions. 
</answer>
</q_a>

<q_a>
<question>
Solution
</question>
<answer>
<copyable>

```javascript

function render(vdomNode, anchorElement) {
  ...
  const newElement = // something here
  ...
  if (attributeName === "style") {
    Object.entries(attributeValue).forEach(([styleName, styleValue]) => {
      newElement.style[styleName] = styleValue;
    });
  }
  ...
};
```
</copyable>
</answer>
</q_a>
</tutorial_step>

<tutorial_step>
# Rendering dynamic JSX

You've got a more thorough method of rendering static JSX now, but your framework is falling short. It really needs to render dynamic content, and one of the features it needs to be able to do this is to allow people to define component's, or functions that return JSX. They look something like this,

```javascript
function FancyButton(props) {
  return <button
      styles={{ borderRadius: "1rem", backgroundColor: "white" }}
      onClick={() => window.alert("This is pretty fancy!")}
    >
    {props.children}
  </button>
}
```

And can be used like this,

```javascript
function App() {
  return <div>
    <FancyButton>fancy button 1</FancyButton>
    <FancyButton>fancy button 2</FancyButton>
    <FancyButton>fancy button 3</FancyButton>
  </div>
}
```

The first problem preventing your framework from being able to handle custom components like this is that Babel doesn't call component functions.

<span class="action">To remedy this follow the steps on the ticket titled "Rendering dynamic JSX."</span>

<q_a>
<question>
Solution
</question>
<answer>
Your `render` function should include a condition like this now.

<copyable>

```javascript
export function render(vdomNode, anchorElement) {
  if (typeof vdomNode.tag === "function") {
    const freshVdomNode = vdomNode.tag(vdomNode.props);
    render(freshVdomNode, anchorElement);
  }
  ...
}
```
</copyable>

Take a moment to absorb what's going on here. When `render` encounters a VDOM node whose tag is a function, it calls that function with the props. If you think about the structure of the VDOM tree. Render gets called once for each node in the tree ordinarily. But when `render` encounters a component, it's not static what VDOM nodes that component should/will make. So, `render` has to call the function—with props—to see what it returns.

Once it's created more VDOM nodes, by calling the component function, it can and should then render them.
</answer>
</q_a>
</tutorial_step>

<tutorial_step>
# Test your render function rendering dynamic JSX

The ticket for this step lays out the steps to test the work you've done to allow users of your framework to define and render components.

Rather than reiterate all the steps in the ticket, I'll leave hints and solutions here.

<span class="action">Check your work using the below expandable sections and then move on.</span>

<q_a>
<question>
"How do I write my own `App` component?"
</question>
<answer>
It's pretty flexible what you make it do (that's kinda the point of a rendering framework), but it should look something like this.

```javascript
function App(props) {
  return props.message ? <div>{props.message}</div> : <div>no message was given</div>
}
```
</answer>
</q_a>

<q_a>
<question>
"How do I write get my `render` function to use the `App` component?"
</question>
<answer>
Almost exactly the same way you got it to render the `vdom` variable earlier.

```javascript
render(<App/>, document.getElementById("root"));
```
</answer>
</q_a>

<q_a>
<question>
"How do I pass an argument to assign the `props` parameter to?"
</question>
<answer>
Since Babel is parsing the `props` and then calling the function identifier it finds with said props, you apply props as you would apply attributes to your other JSX elements, like this,

```javascript
render(<App message={"hello world"}/>, document.getElementById("root"));
```
</answer>
</q_a>
</tutorial_step>

<tutorial_step>
# Rerendering

You're one step closer to having truly dynamic content. The next step is that you need to rerender the DOM. Without a way to rerender the DOM, apps made with your framework cannot possibly change.

<span class="action">Follow the steps on the ticket associated with this step to define your `rerender` function and to establish some necessary variables you'll need for your framework in `framework.js`.</span>

<q_a>
<question>
"What is the `roots` variable for?"
</question>
<answer>
You need this variable because when you rerender the DOM down the line you wont necessarily have the root VDOM node and anchor DOM element handed to you by the user of your framework the way you do in `exampleApp/index.js`.

By storing the root VDOM node and anchor DOM element when render is first called by the user of your framework, you can then subsequently rerender the DOM based on any changed made to your VDOM later. This interaction of allowing changed to your VDOM and then rerendering the DOM is one of the classic workflows that rendering frameworks use to render dynamic content.

```javascript
let roots; // declaration without assignment

function render(vdomNode, anchorElement) {
  // if roots hasn't been assigned yet, assign it, otherwise leave it alone
  if (!roots) roots = [vdomNode, anchorElement];
}
```
</answer>
</q_a>

<q_a>
<question>
"How/why do I clear the DOM as the first step to rerendering it?"
</question>
<answer>
Without this step you'll end up appending multiple instances of the user's app to the DOM, one after another. You won't really be "rerendering" so much as you'll just be rendering again. This looks bad and when you see it happen is an obvious mistake.

Instead you want to start with a clean slate to render the updated version of the user's app on.

To do this simply get the anchor DOM element the user specified when they first called `render` and clear all of its children like this,

```javascript
...
// assuming the second element of your roots variable is the DOM element passed to 
roots[1].innerHtml = "";
...
```
</answer>
</q_a>

<q_a>
<question>
"Is `rerender` supposed to call `render`? What's the point?"
</question>
<answer>
Yes! And the point is that the user of your framework should call render once themselves and then not need to worry about it again. So `render` is for them. `rerender` enables you, as the developer of the framework to program the logic for how and when the DOM should change. `rerender` is for you.

By calling `render` the user of your framework tells you which VDOM and DOM elements need to connect at the root of their app. You store these two objects in your `roots` array when they call `render` and then subsequently when you call `rerender` can recall those elements to call `render` yourself with the same arguments the user specified.

Put another way, `rerender` is basically `render` but with a little extra logic to recall the root of the VDOM and the anchor DOM element that the user of your framework originally specified represent the roots of their app. Calling `rerender` doesn't take specific knowledge about the app being rendered. Calling `render` does. That's the difference.

`rerender` should look something like this.

```javascript
function rerender() {
  roots[1].innerHTML = "";
  render(roots[0], roots[1]);
}
```
</answer>
</q_a>

</tutorial_step>

<tutorial_step>
# Making state

The final piece in the puzzle to enabling dynamic applications is allowing the user of your framework to make changes to the VDOM and instigating rerenders.

**State** is the primary tool to do this with all rendering frameworks. There are other means of triggering rerenders in most frameworks of the class that you're building, but state/state changes are the most common way. Also it'll be the only way you provide to you're users unless you go above and beyond on this project on your own.

Yet again the "Making state" ticket covers the various steps to allowing users to create state but here I'll try to provide you intuition for why those steps need to happen and answer the natural questions I expect you might have.

<q_a>
<question>
"What is state?"
</question>
<answer>
**State**, in the context of client side rendering frameworks, is a special type of variable that when changed triggers a rerender.

In a more general programming context, state is all of the information your program needs to run correctly. Often connoting information that must be managed in memory while the application is running.
</answer>
</q_a>

<q_a>
<question>
"Why `stateStore`?"
</question>
<answer>
This variable comes from the jargon **store** a data structure used as the central source of state for an application.

`store` is also a reasonable variable name here.
</answer>
</q_a>

<q_a>
<question>
"Why is `stateStore` an array?"
</question>
<answer>
You need a way to store all the different pieces fo state a user might define in their app. An array is just a simple way of storing an arbitrary list of data, which is what the `stateStore` is.
</answer>
</q_a>

<q_a>
<question>
"Why do I need an `updater` function? Why do I have to call a function just to reassign a variable?"
</question>
<answer>
Say someone was using your framework, or any framework, and they got a hold of your VDOM. They would be able to make changes, and theoretically the VDOM is supposed to reflect the DOM. But, your framework doesn't inherently know that the VDOM doesn't match the DOM. It's not psychic, or magic, it's just JS!

By creating an `updater` function with each piece of state that is created, you're built a way for users of your framework to update their state such that your framework can do any and all appropriate actions it needs to when such a change is made. A.k.a. you've given users of your framework the ability to rerender their app to reflect changes made to state.
</answer>
</q_a>

<q_a>
<question>
"What's going on with this `currentStateIndex` variable? Why am I supposed to increment it and reset it the way the ticket instructs me to?"
</question>
<answer>
The problem you're solving is that you need to associate specific state that user's of your framework create with the correct indices in the `stateStore` array.

There are two parts to this that accomplish the task.

1. When the `makeState` function is called it stores a copy of the `currentStateIndex` variables value as a new variable in its closure.
2. It increments the `currentStateIndex` variable so that the next piece of state the user makes will have a new index in the `stateStore` to store its value in.

Also, when `rerender` is called you need to reset `currentStateIndex` to `0` because you're about to call all the component functions again (that's how you generate teh new VDOM nodes that reflect the new state for the rerender). Since you're calling the component functions again, you're also calling the `makeState` variable again for each time it was used throughout the app.

Now, the simplicity of using an array and incrementing an index to match state with indices int eh `stateStore` may leave you with some questions. Reasonably so, it only works circumstantially. Granted it works under a lot fo circumstances, but you would need to be a seasoned front end developer to devise a method of making a fool proof state management system.

In short, each rerender basically makes the entire app anew. Components that remain in relative positions in the VDOM will find their state accordingly anyway, even though they're technically brand new, and `makeState` was called in them to generate new state when the rerender occurred. `stateStore` doesn't get cleared out between rerenders, so components often find their state from previous renders just fine. Also `updater` functions for various pieces of state rely on the same logic.

Take a look at this diagram to try to visualize an `updater` function being called, causing a rerender, and the `stateStore` array's various indices coinciding with the same pieces of state after said rerender.

![state across rerender](https://drive.google.com/uc?export=view&id=17hUVlrif5Yo_wi_taIS9yYMvmkBVGYSl)
</answer>
</q_a>
</tutorial_step>

<tutorial_step>
# Use your framework

At this point you've done the heavy lifting. You have made a working rendering framework, pending any bugs (unexpected ones beyond the fact that you know your state management system works only if your VDOM isn't sufficiently restructured during rerenders).

Nice work! This is a really tough project. Most professional developers wouldn't know where to start if they had to make a rendering framework from scratch.

It's time to put your work to the test. Follow the specs in the ticket associated with this step to test the metal of your framework.

<q_a>
<question>
Fatigued and just want some JSX to test your work with?
</question>
<answer>
Sure! Paste the following into their respective files in the `exampleApp` directory. You will need to make the blank files too.

`App.jsx`
<copyable>

```javascript
import { makeState } from "../framework.js";
import Counter from "./Counter.jsx";

export default function App() {
  const [counters, setCounters] = makeState(0)
  return <div>
  <button onClick={() => setCounters(Math.max(0, counters-1))}>-</button>
  {counters}
  <button onClick={() => setCounters(counters+1)}>+</button>
  {Array.from({ length: counters }, () => <Counter/>)}
  </div>
}
```
</copyable>

`Counter.jsx`
<copyable>

```javascript
import { makeState } from "../framework.js";

export default function Counter() {
  const [counter, setCounter] = makeState(0)
  return <div>
  <button onClick={() => setCounter(Math.max(0, counter-1))}>-</button>
  {counter}
  <button onClick={() => setCounter(counter+1)}>+</button>
  </div>
}
```
</copyable>

`index.js`
<copyable>

```javascript
import { render } from "../framework.js";
import App from "./App.jsx";

render(<App/>, document.getElementById("root"));
```
</copyable>
</answer>
</q_a>
</tutorial_step>