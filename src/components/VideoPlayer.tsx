import React, { useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import styled from 'styled-components';
import { IconButton, Slider } from '@mui/material';
import { PlayArrow, Pause, VolumeUp, VolumeOff } from '@mui/icons-material';

const PlayerWrapper = styled.div`
  position: relative;
  padding-top: 56.25%;
`;

const PlayerContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Controls = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1;
`;

interface VideoPlayerProps {
  url: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleVolumeChange = (_: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
  };

  const handleMute = () => {
    setMuted(!muted);
  };

  return (
    <PlayerWrapper>
      <PlayerContainer>
        <ReactPlayer
          ref={playerRef}
          url={url}
          width="100%"
          height="100%"
          playing={playing}
          volume={volume}
          muted={muted}
          controls={false}
        />
        <Controls>
          <IconButton onClick={handlePlayPause} color="primary">
            {playing ? <Pause /> : <PlayArrow />}
          </IconButton>
          <IconButton onClick={handleMute} color="primary">
            {muted ? <VolumeOff /> : <VolumeUp />}
          </IconButton>
          <Slider
            value={volume}
            onChange={handleVolumeChange}
            min={0}
            max={1}
            step={0.1}
            sx={{ width: 100 }}
          />
        </Controls>
      </PlayerContainer>
    </PlayerWrapper>
  );
};