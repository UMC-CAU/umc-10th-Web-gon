import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import type { Movie } from "../types/movie";
import useCustomFetch from "../hooks/useCustomFetch";

interface MoviePageProps {
    category: string;
}

interface MovieResponse {
    results: Movie[];
}

export default function MoviePage({ category }: MoviePageProps) {
    const [page, setPage] = useState(1);

    useEffect(() => {
        setPage(1);
    }, [category]);

    const { data, loading: isLoading, error: isError } = useCustomFetch<MovieResponse>(
        `https://api.themoviedb.org/3/movie/${category}`,
        {
            language: 'ko-KR',
            page: page
        }
    );

    const movies = data?.results;

    const getTitle = () => {
        if (category === 'popular') return '인기 영화 목록';
        if (category === 'now_playing') return '상영 중인 영화';
        if (category === 'top_rated') return '평점 높은 영화';
        if (category === 'upcoming') return '개봉 예정 영화';
    };

    if (isLoading) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-2xl font-bold">데이터를 불러오는 중입니다... ⏳</h2>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-10 text-center text-red-600">
                <h2 className="text-2xl font-bold mb-4">에러가 발생했습니다! 🚨</h2>
                <p>API 키가 잘못되었거나 인터넷이 끊겼을 수 있습니다.</p>
            </div>
        );
    }

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-8">{getTitle()}</h1>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {movies && movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>

            <div className="flex justify-center items-center gap-6 mt-10">
                <button 
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 bg-blue-500 text-white font-bold rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                >
                    이전
                </button>
                <span className="font-bold text-xl">{page} 페이지</span>
                <button 
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition-colors"
                >
                    다음
                </button>
            </div>
        </div>
    );
}