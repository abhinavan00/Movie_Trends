import React, { useState, useEffect } from "react";

const MovieCard = ({API_BASE_URL, API_OPTIONS, movie: {title, year, images, watchers, ids} }) => {
    const poster = images?.poster?.[0];
    const [rating, setRating] = useState(null);
    const [votes, setVotes] = useState(null);
    
    useEffect(() => {
        const endPoint = `${API_BASE_URL}/movies/${ids.slug}/ratings`;
        fetch(endPoint, API_OPTIONS)
            .then(response => response.json())
            .then(data => {setRating(data.rating); setVotes(data.votes);})
            .catch(error => console.error('Error fetching rating:', error));
    }, [API_BASE_URL, API_OPTIONS, ids.slug]);

    return (
        <div className="movie-card">
            <img src={poster ? (poster.startsWith('http') ? poster : `https://${poster}`) : ''} alt={`${title} Poster`} />
            
            <div className='mt-4'>
                <h3>{title}</h3>
            </div>

            <div className="content">
                <div className="rating">
                    <img src="star.svg" alt="Star Icon" />
                    <p className='text-white'>{rating ? rating.toFixed(1) : 'N/A'}</p>
                </div>

                <span>•</span>
                <p className="lang">Votes: {votes ? votes : 'N/A'}</p>

                <span>•</span>
                <p className="year">{year ? year : 'N/A'}</p>
            </div>
        </div>
    )
}

export default MovieCard;