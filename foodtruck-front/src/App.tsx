import { useState } from "react";
import "./App.css";
import { GlobalStyle } from "./styles/Global";
import MainRouter from "./router/MainRouter";
import { Toaster } from "react-hot-toast";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <GlobalStyle />
      <MainRouter />
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          duration: 4000,
          style: {
            minWidth: "300px",
            padding: "14px 16px",
            fontSize: "14px",
            fontWeight: 600,
            marginBottom: "24px",
            marginRight: "24px"
          }
        }}
      />
    </>
  );
}

export default App;
