import { useState } from "react";
import "./App.css";
import { GlobalStyle } from "./styles/Global";
import MainRouter from "./router/MainRouter";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <GlobalStyle />
      <MainRouter />
    </>
  );
}

export default App;
