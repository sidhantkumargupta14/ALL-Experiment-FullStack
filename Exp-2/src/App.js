import Counter1 from "./components/Counter1";
import Counter2 from "./components/Counter2";

function App() {
  return (
    <div style={{ textAlign: "center" }}>
      <h1> Multiple Counter</h1>

      <Counter1 />

      <hr />

      <Counter2 />
    </div>
  );
}

export default App;