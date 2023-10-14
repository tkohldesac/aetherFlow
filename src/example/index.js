import {render} from "../aetherFlow";

// all you can do is log these objects which will show you what babel and the jsx-runtime file you write are doing
console.log(<div><button>haha you can't see me</button></div>)

const rootExample = <div><button>haha you can't see me</button></div>

const rootDiv = document.getElementById('root')

render(rootExample, rootDiv);

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


