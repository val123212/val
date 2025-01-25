import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';

const StyledIconButton = styled(IconButton)`
  color: #f50057;
`;

interface FavoriteButtonProps {
  animeCode: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ animeCode }) => {
  const { user, isInFavorites, addToFavorites, removeFromFavorites, login } = useAuth();

  const handleClick = () => {
    if (!user) {
      login();
      return;
    }

    if (isInFavorites(animeCode)) {
      removeFromFavorites(animeCode);
    } else {
      addToFavorites(animeCode);
    }
  };

  return (
    <Tooltip title={user ? 'Добавить в избранное' : 'Войдите, чтобы добавить в избранное'}>
      <StyledIconButton onClick={handleClick}>
        {isInFavorites(animeCode) ? <Favorite /> : <FavoriteBorder />}
      </StyledIconButton>
    </Tooltip>
  );
};