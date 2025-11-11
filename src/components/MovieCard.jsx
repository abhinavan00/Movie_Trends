import React from "react";

const MovieCard = ({API_BASE_URL, API_OPTIONS, movie: {title, year, images, watchers, ids} }) => {
    const poster = images?.poster?.[0];
    const endPoint = `${API_BASE_URL}/movies/${ids.slug}/ratings`;
    const rating = async() => await fetch(endPoint, API_OPTIONS)
        .then(response => response.json())
        .then(data => console.log(data))
        .then(data => data.rating)  
        
    console.log('Movie rating:', rating);

    return (
        <div className="movie-card">
            <img src={poster ? (poster.startsWith('http') ? poster : `https://${poster}`) : ''} alt={`${title} Poster`} />
            
            <div className='mt-4'>
                <h3>{title}</h3>
            </div>

            <div className="content">
                <div className="rating">
                    <img src="star.svg" alt="Star Icon" />
                    <p className='text-white'>{rating ? rating.rating : 'N/A'}</p>
                </div>
            </div>
        </div>
    )
}

export default MovieCard;