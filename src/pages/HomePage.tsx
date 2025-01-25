import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AnimeCard } from '../components/AnimeCard';
import { animeService } from '../services/anime.service';
import { Anime } from '../types/anime.types';
import { Grid, Container, CircularProgress } from '@mui/material';

const StyledContainer = styled(Container)`
  padding: 2rem 0;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

export const HomePage: React.FC = () => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        const response = await animeService.getUpdates({
          limit: 20,
          playlist_type: 'array'
        });
        setAnimes(response.data.list);
      } catch (error) {
        console.error('Error fetching animes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimes();
  }, []);

  if (loading) {
    return (
      <LoadingWrapper>
        <CircularProgress />
      </LoadingWrapper>
    );
  }

  return (
    <StyledContainer>
      <Grid container spacing={3}>
        {animes.map((anime) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={anime.id}>
            <AnimeCard anime={anime} />
          </Grid>
        ))}
      </Grid>
    </StyledContainer>
  );
};