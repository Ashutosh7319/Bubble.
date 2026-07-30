import Hero from '../components/Hero';
import MediaRow from '../components/MediaRow';

const Home = () => {
  return (
    <div className="fade-in" style={{ paddingBottom: '4rem' }}>
      <Hero />
      
      <div style={{ marginTop: '-8rem', position: 'relative', zIndex: 10 }}>
        <MediaRow 
          title="Trending Movies" 
          fetchUrl="/trending/movie/week" 
          mediaType="movie" 
        />
        
        <MediaRow 
          title="Trending TV Shows" 
          fetchUrl="/trending/tv/week" 
          mediaType="tv" 
        />
        
        <MediaRow 
          title="Top Rated Movies" 
          fetchUrl="/movie/top_rated" 
          mediaType="movie" 
        />
        
        <MediaRow 
          title="Top Rated TV Shows" 
          fetchUrl="/tv/top_rated" 
          mediaType="tv" 
        />
      </div>
    </div>
  );
};

export default Home;
