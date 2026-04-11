import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import useCustomFetch from '../hooks/useCustomFetch';
import type { Credits, MovieDetails } from '../types/movie-detail';

const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();

  const { data: movie, loading: movieLoading, error: movieError } = useCustomFetch<MovieDetails>(
    `https://api.themoviedb.org/3/movie/${movieId}`,
    {
      language: 'ko-KR',
      api_key: import.meta.env.VITE_TMDB_KEY
    }
  );

  const { data: credits, loading: creditsLoading, error: creditsError } = useCustomFetch<Credits>(
    `https://api.themoviedb.org/3/movie/${movieId}/credits`,
    {
      language: 'ko-KR',
      api_key: import.meta.env.VITE_TMDB_KEY
    }
  );

  const isLoading = movieLoading || creditsLoading;
  const isError = movieError || creditsError;

  const directorNames = useMemo(() => {
    if (!credits) return [];
    return credits.crew
      .filter((member) => member.job === 'Director')
      .map((member) => member.name);
  }, [credits]);

  if (isLoading) {
    return (
      <div className="p-10 text-center text-lg font-semibold text-gray-700">
        영화 상세 정보를 불러오는 중입니다... ⏳
      </div>
    );
  }

  if (isError || !movie || !credits) {
    return (
      <div className="p-10 text-center text-red-500 font-semibold">
        영화 정보를 불러오지 못했습니다 🚨
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-white p-6 md:p-10">
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[320px,1fr] gap-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 shadow-2xl">
        <img
          src={`${imageBaseUrl}${movie.poster_path}`}
          alt={movie.title}
          className="w-full rounded-xl shadow-lg object-cover"
        />
        <div className="space-y-5">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{movie.title}</h1>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-black font-bold">
              평점 {movie.vote_average.toFixed(1)}
            </span>
            <span className="px-3 py-1 rounded-full bg-sky-500/80">개봉일 {movie.release_date}</span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/80">상영시간 {movie.runtime}분</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <span key={genre.id} className="px-2 py-1 text-xs rounded-md bg-white/20">
                {genre.name}
              </span>
            ))}
          </div>
          <p className="leading-7 text-slate-100/90 whitespace-pre-line">{movie.overview}</p>
          <div>
            <h2 className="text-xl font-bold mb-2">감독</h2>
            <p className="text-slate-200">{directorNames.length > 0 ? directorNames.join(', ') : '정보 없음'}</p>
          </div>
        </div>
      </section>
      
      <section className="max-w-6xl mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">주요 출연진</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {credits.cast.slice(0, 10).map((member) => (
            <li key={member.id} className="bg-white/10 border border-white/15 rounded-xl p-3">
              <img
                src={
                  member.profile_path
                    ? `${imageBaseUrl}${member.profile_path}`
                    : 'https://via.placeholder.com/300x450?text=No+Image'
                }
                alt={member.name}
                className="w-full aspect-[2/3] object-cover rounded-md mb-2"
              />
              <p className="font-semibold text-sm line-clamp-1">{member.name}</p>
              <p className="text-xs text-slate-300 line-clamp-1">{member.character}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}