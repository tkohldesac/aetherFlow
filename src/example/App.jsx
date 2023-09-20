import Button from './Button';
import Dialog from './Dialog';
import { makeState } from "../renderingFramework";

const App = () => {
  const [c1, setC1] = makeState(0);
  const [c2, setC2] = makeState(0);
  const [c3, setC3] = makeState(0);
  const [open, setOpen] = makeState(false);

  return (
    <div class="app">
      <Button count={c1} style={{ "backgroundColor": "red" }} onClick={() => setC1(c1+1)}>{c1}</Button>
      <Button count={c2} onClick={() => setC2(c2+1)}>{c2}</Button>
      <Button count={c3} onClick={() => setC3(c3+1)}>{c3}</Button>
      <Button count={1} onClick={() => setOpen(true)}>open</Button>
      {Array.from({ length: c1 }).map((_,i) => (<Button count={1} onClick={() => {
        alert(i)
      }}>hello</Button>))}
      {open?<Dialog setOpen={setOpen}/>:null}
    </div>
  )
};

export default App;
