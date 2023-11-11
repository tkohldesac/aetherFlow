import { render } from "../aetherflow";

// all you can do is log these objects which will show you what babel and the jsx-runtime file you write are doing

const exampleElement = (
  <h1 style={{ backgroundColor: "green" }}>
    <button 
    disabled={false}
     onClick={() => console.log("clicked!")}>
      Click meh
    </button>
  </h1>
);
const rootDiv = document.getElementById("root");

// Side note - look for the result of render in the Inspector, not the console...
render(exampleElement, rootDiv);

// console.log(<div onClick={() => {console.log('hi')}}>
// Hello World!
// </div>)

// // x=root
// const x = {
// tag: "div",
// props: {
//   onClick: ()=> {console.log('hi')},
//   children: 'Hello World!'
// }
// }

// console.log(x);
