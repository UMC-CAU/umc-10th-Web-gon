// src/App.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import MoviePage from "./pages/MoviePage";
import NotFound from "./pages/NotFound";
import MovieDetailPage from "./pages/MovieDetailPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <MoviePage category="popular" /> },
      { path: "now-playing", element: <MoviePage category="now_playing" /> },
      { path: "top-rated", element: <MoviePage category="top_rated" /> },
      { path: "upcoming", element: <MoviePage category="upcoming" /> },
      { path: "movies/:movieId", element: <MovieDetailPage /> }, 
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;