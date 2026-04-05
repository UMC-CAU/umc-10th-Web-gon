// src/pages/MovieDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { MovieDetails, Credits } from "../types/movie";

export default function MovieDetailPage() {
    const { movieId } = useParams();

    const [movie, setMovie] = useState<MovieDetails | null>(null);
    const [credits, setCredits] = useState<Credits | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            setIsLoading(true);
            setIsError(false);

            try {
                const [detailResponse, creditsResponse] = await Promise.all([
                    axios.get(`https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`, {
                        headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` }
                    }),
                    axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`, {
                        headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` }
                    })
                ]);

                setMovie(detailResponse.data);
                setCredits(creditsResponse.data);
            } catch (error) {
                console.error("데이터 통신 중 에러 발생:", error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        if (movieId) {
            fetchMovieDetails();
        }
    }, [movieId]);

    if (isLoading) return <div className="p-20 text-center text-white text-2xl">로딩 중... ⏳</div>;
    if (isError || !movie) return <div className="p-20 text-center text-red-500 text-2xl">데이터를 불러올 수 없습니다 🚨</div>;

    return (
        <div className="min-h-screen bg-black text-white">
            <div 
                className="relative p-10 md:p-20 flex flex-col md:flex-row gap-10 items-center bg-cover bg-center"
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9) 30%, rgba(0,0,0,0.4)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
                }}
            >
                <img 
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                    alt={movie.title} 
                    className="w-64 rounded-lg shadow-2xl z-10"
                />

                <div className="z-10 max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>
                    
                    <div className="flex flex-col text-gray-300 mb-6 text-sm font-semibold gap-1">
                        <p>⭐ 평균 {movie.vote_average.toFixed(1)}</p>
                        
                        <p>{movie.release_date.substring(0, 4)}</p>
                    
                        <p>{movie.runtime}분</p>
                    </div>

                    {movie.tagline && <p className="text-xl italic mb-4 text-gray-400">"{movie.tagline}"</p>}
                    
                    <p className="text-lg leading-relaxed text-gray-200 line-clamp-6">{movie.overview}</p>
                </div>
            </div>

            <div className="p-10 md:p-20">
                <h2 className="text-2xl font-bold mb-8">감독/출연</h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-x-6 gap-y-10">
                    {credits?.cast.slice(0, 14).map((actor) => ( 
                        <div key={actor.id} className="flex flex-col items-center flex-shrink-0 text-center">
                            
                            {actor.profile_path ? (
                                <img 
                                    src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`} 
                                    alt={actor.name}
                                    className="w-28 h-28 rounded-full object-cover mb-4 border border-gray-700 shadow-lg"
                                />
                            ) : (
                                <div className="w-28 h-28 rounded-full bg-gray-800 mb-4 flex items-center justify-center text-gray-500 border border-gray-700 text-xs shadow-lg">
                                    No Image
                                </div>
                            )}
                
                            <span className="font-semibold text-sm mb-1 line-clamp-1">{actor.name}</span>
                            <span className="text-gray-400 text-xs line-clamp-1">{actor.character}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}