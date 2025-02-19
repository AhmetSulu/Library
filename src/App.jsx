import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import RootProvider from "./contexts/RootProvider";
import Layout from "./components/common/Layout";
import Spinner from "./components/common/Spinner";
import "./styles/global.css";

const Home = lazy(() => import("./pages/Home"));
const Publishers = lazy(() => import("./components/publishers/Publishers"));
const Categories = lazy(() => import("./components/categories/Categories"));
const Books = lazy(() => import("./components/books/Books"));
const Authors = lazy(() => import("./components/authors/Authors"));
const Borrows = lazy(() => import("./components/borrows/Borrows"));

const routes = [
  { path: "/", element: <Home /> },
  { path: "publishers", element: <Publishers /> },
  { path: "categories", element: <Categories /> },
  { path: "books", element: <Books /> },
  { path: "authors", element: <Authors /> },
  { path: "borrows", element: <Borrows /> }
];

export function App() {
  return (
    <RootProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {routes.map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={
                  <Suspense fallback={<Spinner />}>
                    {element}
                  </Suspense>
                }
                index={path === "/"}
              />
            ))}
            {/* 404 page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RootProvider>
  );
}