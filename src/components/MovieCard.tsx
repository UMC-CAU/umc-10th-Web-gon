// src/components/MovieCard.tsx
import { useNavigate } from "react-router-dom"; // 👈 추가
import type { Movie } from "../types/movie"

interface MovieCardProps {
    movie: Movie
}

export default function MovieCard({ movie }: MovieCardProps) {
    const navigate = useNavigate(); 

    return (
        <div 
            onClick={() => navigate(`/movies/${movie.id}`)} 
            className="relative group overflow-hidden rounded-xl shadow-lg cursor-pointer"
        >
            <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-4">
                <h3 className="text-white text-lg font-bold mb-2 text-center">{movie.title}</h3>
                <p className="text-gray-300 text-sm line-clamp-5">{movie.overview}</p>
            </div>
        </div>
    )
}