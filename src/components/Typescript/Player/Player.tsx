import React, { useEffect } from 'react';
import { getYoutubeId } from '../../../utils';

declare const window: any;

const Player: React.FC = () => {
  const useYoutube = (callback: any) => {
    useEffect(() => {
      if (!window.YT) {
        let tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/player_api';
        let firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
        tag.onload = callback;
      } else {
        callback();
      }
    }, [callback]);
  };

  let player: any = [{}];
  const onYouTubePlayerAPIReady = () => {
    Array.from(document.querySelectorAll('iframe'))
      .filter((x: any) => x.classList[0] === 'youtube-embed-embed')
      .map((x: any, index: number) => {
        if (!x.id) {
          x.id = 'youtube-player-' + index;
        }

        window.YT.ready(() => {
          player[index] = new window.YT.Player(x.id, {
            events: {
              onReady: onPlayerReady,
              videoId: getYoutubeId(x.src),
              onStateChange: (event: any) => {
                if (event.data === window.YT.PlayerState.PLAYING) {
                  player.map((x: any) => {
                    if (
                      x.playerInfo.playerState ===
                        window.YT.PlayerState.PLAYING &&
                      x.h.id !== event.target.h.id
                    ) {
                      x.h.contentWindow.postMessage(
                        '{"event":"command","func":"pauseVideo","args":""}',
                        '*'
                      );
                    }
                  });
                }
              },
            },
          });

          function onPlayerReady() {
            const pauseButton: any = document.getElementById('pause-button');

            pauseButton.addEventListener('click', function () {
              player[index].pauseVideo();
            });
          }
        });

        return x;
      });
  };

  useYoutube(onYouTubePlayerAPIReady);

  return <div />;
};

export default Player;
