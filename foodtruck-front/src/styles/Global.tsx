import { css, Global } from "@emotion/react";
import React from "react";

export const GlobalStyle = () => (
  <Global
    styles={css`
      *,
      *::before,
      *::after {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      html,
      body,
      #root {
        height: 100%;
      }

      body {
        font-family: Arial, Helvetica, sans-serif;
        background: #f8fafc;
        color: #111827;
      }

      a {
        text-decoration: none;
        color: inherit;
      }

      ul,
      li {
        list-style: none;
      }
      :root {
        --primary: #4f46e5;
        --sidebar-width: 220px;
        --header-height: 60px;
        --footer-height: 50px;
      }
    `}
  />
);
