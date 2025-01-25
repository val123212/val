import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { VideoPlayer } from '../components/VideoPlayer';
import { animeService } from '../services/anime.service';
import { Anime } from '../types/anime.types';
import { useAuth } from '../contexts/AuthContext';
import { 
  Container, 
  Typography, 
  CircularProgress, 
  Paper,
  Button,
  Box,
  Chip,
  IconButton,
  Tooltip 
} from '@mui/material';
import { ArrowBack, Favorite, FavoriteBorder } from '@mui/icons-material';
import { toast } from 'react-toastify';

const StyledContainer = styled(Container)`
  padding: 2rem 0;
  margin-top: 64px;
`;

const AnimeInfo = styled(Paper)`
  padding: 2rem;
  margin: 2rem 0;
  background: #1a1a1a;
  color: #fff;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 64px);
`;

const BackButton = styled(Button)`
  margin-bottom: 1rem;
`;

const AnimePoster = styled.img`
  max-width: 300px;
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1rem 0;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
`;

const GenresContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 1rem 0;
`;

const StyledFavoriteButton = styled(IconButton)`
  &:hover {
    background-color: rgba(245, 0, 87, 0.1);
  }
`;

export const AnimePage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, isInFavorites, addToFavorites, removeFromFavorites, login } = useAuth();

  useEffect(() => {
    const fetchAnime = async () => {
      if (!code) {
        setError('Код аниме не найден');
        setLoading(false);
        return;
      }

      try {
        const response = await animeService.getTitle({ code });
        setAnime(response.data);
      } catch (error) {
        console.error('Error fetching anime:', error);
        setError('Ошибка при загрузке аниме');
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [code]);

  const handleFavoriteClick = async () => {
    if (!anime) return;
    
    if (!user) {
      login();
      return;
    }

    try {
      if (isInFavorites(anime.code)) {
        await removeFromFavorites(anime.code);
        toast.success('Удалено из избранного');
      } else {
        await addToFavorites(anime.code);
        toast.success('Добавлено в избранное');
      }
    } catch (error) {
      toast.error('Произошла ошибка');
    }
  };

  if (loading) {
    return (
      <LoadingWrapper>
        <CircularProgress />
      </LoadingWrapper>
    );
  }

  if (error || !anime) {
    return (
      <StyledContainer>
        <Typography color="error" gutterBottom>
          {error || 'Аниме не найдено'}
        </Typography>
        <BackButton
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          variant="contained"
          color="primary"
        >
          Вернуться на главную
        </BackButton>
      </StyledContainer>
    );
  }

  const videoUrl = anime.player?.playlist?.[0]?.hls?.fhd
    ? `https://anilibria.tv${anime.player.playlist[0].hls.fhd}`
    : '';

  const posterUrl = anime.posters?.medium?.url
    ? (anime.posters.medium.url.startsWith('/')
      ? `https://anilibria.tv${anime.posters.medium.url}`
      : anime.posters.medium.url)
    : '';

  return (
    <StyledContainer>
      <BackButton
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        variant="contained"
        color="primary"
      >
        Вернуться на главную
      </BackButton>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography variant="h4" component="h1" color="white">
          {anime.names?.ru || 'Без названия'}
        </Typography>
        <Tooltip title={user ? 'Добавить в избранное' : 'Войдите, чтобы добавить в избранное'}>
          <StyledFavoriteButton
            onClick={handleFavoriteClick}
            color="primary"
          >
            {isInFavorites(anime.code) ? <Favorite /> : <FavoriteBorder />}
          </StyledFavoriteButton>
        </Tooltip>
      </Box>

      <Box sx={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {posterUrl && (
          <Box sx={{ flexBasis: '300px', flexShrink: 0 }}>
            <AnimePoster
              src={posterUrl}
              alt={anime.names?.ru || 'Постер аниме'}
              loading="lazy"
            />
          </Box>
        )}
        
        <Box sx={{ flex: 1, minWidth: '300px' }}>
          {videoUrl && <VideoPlayer url={videoUrl} />}
        </Box>
      </Box>

      <AnimeInfo>
        <Typography variant="h6" gutterBottom>
          Информация об аниме
        </Typography>
        
        {anime.names?.en && (
          <Typography paragraph>
            <strong>Английское название:</strong> {anime.names.en}
          </Typography>
        )}
        
        {anime.genres && anime.genres.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography component="div" gutterBottom>
              <strong>Жанры:</strong>
            </Typography>
            <GenresContainer>
              {anime.genres.map((genre) => (
                <Chip
                  key={genre}
                  label={genre}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </GenresContainer>
          </Box>
        )}
        
        {anime.description && (
          <Typography paragraph>
            <strong>Описание:</strong> {anime.description}
          </Typography>
        )}
        
        {anime.type?.full_string && (
          <Typography paragraph>
            <strong>Тип:</strong> {anime.type.full_string}
          </Typography>
        )}
        
        {anime.status?.string && (
          <Typography>
            <strong>Статус:</strong> {anime.status.string}
          </Typography>
        )}
      </AnimeInfo>
    </StyledContainer>
  );
};