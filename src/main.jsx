import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import { RouterProvider } from "react-router-dom";
import router from "./utils/Router.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HeroUIProvider>
      <ToastProvider />
      <RouterProvider
        future={{
          v7_startTransition: true,
        }}
        router={router}
      />
    </HeroUIProvider>
  </StrictMode>
);
