import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Anime } from '../types/anime.types';

const Card = styled(motion.div)`
  background: #1a1a1a;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 1rem;
  color: #fff;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
  color: #fff;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: #ccc;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
`;

interface AnimeCardProps {
  anime: Anime;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
  const imageUrl = anime.posters.medium.url.startsWith('/')
    ? `https://anilibria.tv${anime.posters.medium.url}`
    : anime.posters.medium.url;

  return (
    <Card
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/anime/${anime.code}`} style={{ textDecoration: 'none', height: '100%' }}>
        <Image
          src={imageUrl}
          alt={anime.names.ru}
          loading="lazy"
        />
        <Content>
          <Title>{anime.names.ru}</Title>
          <Description>{anime.description}</Description>
        </Content>
      </Link>
    </Card>
  );
};