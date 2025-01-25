import React from 'react';
import { Button, Avatar, Menu, MenuItem } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const UserAvatar = styled(Avatar)`
  width: 32px;
  height: 32px;
`;

export const AuthButton: React.FC = () => {
  const { user, login, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  if (!user) {
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={login}
      >
        Войти через Telegram
      </Button>
    );
  }

  return (
    <>
      <UserInfo onClick={handleClick}>
        <UserAvatar
          src={user.photoUrl}
          alt={user.username}
        />
        {user.username}
      </UserInfo>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleLogout}>Выйти</MenuItem>
      </Menu>
    </>
  );
};