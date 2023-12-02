import { render } from "../aetherflow";
import App from "./App.jsx";
// all you can do is log these objects which will show you what babel and the jsx-runtime file you write are doing

// const exampleElement = (
//   <h1 style={{ backgroundColor: "green" }}>
//     <button
//     disabled={false}
//      onClick={() => console.log("clicked!")}>
//       Click meh
//     </button>
//   </h1>
// );
const rootDiv = document.getElementById("root");

render(<App />, rootDiv);
