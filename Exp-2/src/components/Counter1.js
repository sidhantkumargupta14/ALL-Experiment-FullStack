import { useDispatch, useSelector } from "react-redux";
import { increment, decrement } from "../features/counterSlice";
import { counterValue } from "../features/selectors";

function Counter1() {
  const dispatch = useDispatch();
  const count = useSelector(counterValue);

  return (
    <div>
      <h2>Counter 1</h2>

      <h1>{count}</h1>

      <button onClick={() => dispatch(increment())}>
        +
      </button>

      <button onClick={() => dispatch(decrement())}>
        -
      </button>
    </div>
  );
}

export default Counter1;