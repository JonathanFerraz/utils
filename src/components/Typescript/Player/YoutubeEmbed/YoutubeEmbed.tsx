import React, { HTMLAttributes, useEffect } from 'react';
import { getUniqueKey } from 'src/utils/youtubeUtils';
import { getYoutubeId } from '../../../../utils';

import './styles.scss';

declare const window: any;

enum YoutubeEmbedControl {
  Never = 0,
  Always = 1,
  MouseClick = 2,
}

interface IYoutubeEmbed extends HTMLAttributes<HTMLIFrameElement> {
  id?: string;
  videoId: string;
  autoPlay?: boolean;
  controls?: YoutubeEmbedControl;
  endMosaic?: boolean;
  showinfo?: boolean;
  raw?: boolean;
}

const YoutubeEmbed: React.FC<IYoutubeEmbed> = ({
  id,
  videoId,
  autoPlay,
  controls,
  showinfo,
  ...rest
}) => {
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
      .filter((x: any) => x.classList[0] === 'youtube-embed')
      .map((x: any, index: number) => {
        if (!x.id) {
          x.id = 'youtube-player-' + index;
        }

        window.YT.ready(() => {
          player[index] = new window.YT.Player(x.id, {
            events: {
              // onReady: onPlayerReady,
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

                    return x;
                  });
                }
              },
            },
          });

          // function onPlayerReady() {
          //   const pauseButton: any = document.getElementById('pause-button');
          //   pauseButton.addEventListener('click', function () {
          //     player[index].pauseVideo();
          //   });
          // }
        });

        return x;
      });
  };

  useYoutube(onYouTubePlayerAPIReady);

  let urlParams: URLSearchParams = new URLSearchParams();
  urlParams.append('enablejsapi', '1');
  urlParams.append('html5', '1');
  urlParams.append('modestbranding', '1');
  urlParams.append('rel', '0');
  urlParams.append('iv_load_policy', '3');
  urlParams.append('fs', '1');
  urlParams.append('showinfo', (showinfo ? 1 : 0).toString());
  urlParams.append('playsinline', '1');
  urlParams.append('autoplay', (autoPlay ? 1 : 0).toString());
  urlParams.append(
    'controls',
    (controls === undefined
      ? YoutubeEmbedControl.MouseClick
      : controls
    ).toString()
  );
  const url = `https://www.youtube.com/embed/${videoId}?${urlParams.toString()}`;

  return (
    <iframe
      id={id}
      className={'youtube-embed'}
      title={getUniqueKey()}
      src={url}
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      frameBorder={0}
      {...rest}
    />
  );
};

export default YoutubeEmbed;
