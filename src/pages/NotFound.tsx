import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">404 - 에러 페이지</h1>
      <p className="mb-4">요청하신 페이지를 찾을 수 없습니다.</p>
      
      <Link to="/" className="text-blue-500 underline hover:text-blue-700">
        메인으로 돌아가기
      </Link>
    </div>
  );
}