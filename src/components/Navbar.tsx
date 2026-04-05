import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const getActiveStyle = ({ isActive }: { isActive: boolean }) =>
    isActive ? "text-blue-600 font-bold" : "text-black";

  return (
    <nav className="p-4 flex gap-5 border-b border-gray-300">
      <Link to="/" className="font-bold mr-5">
      </Link>

      <NavLink to="/" className={getActiveStyle}>
        인기 영화
      </NavLink>
      <NavLink to="/now-playing" className={getActiveStyle}>
        상영 중
      </NavLink>
      <NavLink to="/top-rated" className={getActiveStyle}>
        평점 높은
      </NavLink>
      <NavLink to="/upcoming" className={getActiveStyle}>
        개봉 예정
      </NavLink>
    </nav>
  );
}