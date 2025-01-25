import React from 'react';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { AuthButton } from './AuthButton';

const StyledAppBar = styled(AppBar)`
  background-color: #1a1a1a;
`;

const StyledContainer = styled(Container)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.5rem;
`;

export const Header: React.FC = () => {
  return (
    <StyledAppBar position="sticky">
      <Toolbar>
        <StyledContainer>
          <Logo to="/">
            <Typography variant="h6">
              Anime Viewer
            </Typography>
          </Logo>
          <AuthButton />
        </StyledContainer>
      </Toolbar>
    </StyledAppBar>
  );
};