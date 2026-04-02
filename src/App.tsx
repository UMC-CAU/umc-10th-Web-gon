import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import MoviePage from "./pages/MoviePage";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <MoviePage category="popular" />,
      },
      {
        path: "now-playing",
        element: <MoviePage category="now_playing" />,
      },
      {
        path: "top-rated",
        element: <MoviePage category="top_rated" />,
      },
      {
        path: "upcoming",
        element: <MoviePage category="upcoming" />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;