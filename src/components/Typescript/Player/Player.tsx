import React, { useMemo, useRef, useState } from 'react';
import { YoutubeEmbed } from './YoutubeEmbed';
import urlParser from 'js-video-url-parser';
import Draggable from 'react-draggable';
import styled from '@emotion/styled';

import './styles.scss';

export const YOUTUBE_PROVIDER = 'youtube';
export const VIMEO_PROVIDER = 'vimeo';

export interface PlayerVideoInfo {
  mediaType: string;
  id: string;
  provider: string;
}

export interface PlayerParserResult extends VideoInfo {
  list?: string;
  params?: any;
}

interface PlayerProps {
  id?: string;
  url: string;
  autoPlay?: boolean;
  raw?: boolean;
  allowPositioning?: boolean;
}

type BoxProps = {
  isControlled?: boolean;
};

const Box = styled.div<BoxProps>`
  cursor: move;
  transition: ${(props: any) =>
    props.isControlled ? `transform 0.3s` : `none`};
`;

const Player: React.FC<PlayerProps> = ({
  url,
  autoPlay,
  raw,
  allowPositioning,
  id,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isControlled, setIsControlled] = useState(true);

  const playerRef = useRef<null | HTMLDivElement>(null);

  const handleStart = () => {
    setIsControlled(false);
  };
  const handleDrag = (e: any, data: any) => {
    setPosition({ x: data.x, y: data.y });
  };
  // const handleStop = () => {
  //   setIsControlled(true);
  //   setPosition({ x: 0, y: 0 });
  // };

  const parserResult = useMemo<PlayerParserResult>(() => {
    return urlParser.parse(url);
  }, [url]);

  const videoId = useMemo<string | null>(() => {
    return !!parserResult ? parserResult.id : null;
  }, [parserResult]);

  const videoProvider = useMemo<string | null>(() => {
    return !!parserResult ? parserResult.provider : null;
  }, [parserResult]);

  if (!parserResult || !videoId || !videoProvider) {
    return <span></span>;
  }

  switch (videoProvider) {
    case YOUTUBE_PROVIDER:
      // case VIMEO_PROVIDER:
      return (
        <>
          {allowPositioning ? (
            <Draggable
              defaultPosition={{ x: 0, y: 0 }}
              position={position}
              onStart={handleStart}
              onDrag={handleDrag}
              // onStop={handleStop}
              defaultClassName={'drag'}
            >
              <Box isControlled={isControlled}>
                <div className={'wrapper-player'} ref={playerRef}>
                  {videoProvider === YOUTUBE_PROVIDER && (
                    <YoutubeEmbed
                      id={id}
                      videoId={videoId}
                      autoPlay={autoPlay}
                      raw={raw}
                    />
                  )}
                </div>
              </Box>
            </Draggable>
          ) : (
            <div className={'wrapper-player'} ref={playerRef}>
              {videoProvider === YOUTUBE_PROVIDER && (
                <YoutubeEmbed
                  id={id}
                  videoId={videoId}
                  autoPlay={autoPlay}
                  raw={raw}
                />
              )}
            </div>
          )}
        </>
      );
    default:
      return <span></span>;
  }
};

export default Player;
