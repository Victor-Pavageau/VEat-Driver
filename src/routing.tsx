import { Route, Routes } from "react-router-dom";
import CreateAccount from "./pages/CreateAccount";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import OrderPage from "./pages/OrderPage";
import MapPage from "./pages/MapPage";
import { io } from "socket.io-client";
import { getUserIdFromJWT } from "./api/common";
import { useEffect } from "react";

export type Path =
  | "/"
  | "/order/:orderId"
  | "/profile"
  | "/profile/create-account"
  | "*";

export const tp = (path: Path, replace?: string[]): Path | string => {
  if (!replace) {
    return path;
  }
  return replacePlaceholders(path, replace);
};

const replacePlaceholders = (url: Path, replaceArray: string[]): string => {
  const expression = /:[\w-_]+/g;
  const array = url.match(expression) as string[];
  if (array.length !== replaceArray.length) {
    throw new Error(
      `Expected array of ${array.length} strings. Found ${replaceArray.length}`
    );
  }
  let result = url.toString();
  for (let i = 0; i < array.length; i++) {
    result = result.replace(array[i], replaceArray[i]);
  }
  return result;
};

const socket = io("localhost", {
  path: "/socket.io/",
  query: {
    clientId: getUserIdFromJWT(),
  },
});

function RouteHandler(): JSX.Element {
  useEffect(() => {
    socket.on("message", (message) => {
      console.log("Received server message:", message);
    });

    return () => {
      socket.off("message");
    };
  }, []);
  return (
    <Routes>
      <Route path={tp("/")} element={<MapPage />} />
      <Route path={tp("/order/:orderId")} element={<OrderPage />} />
      <Route path={tp("/profile")} element={<ProfilePage />} />
      <Route path={tp("/profile/create-account")} element={<CreateAccount />} />
      <Route path={tp("*")} element={<NotFoundPage />} />
    </Routes>
  );
}

export default RouteHandler;
