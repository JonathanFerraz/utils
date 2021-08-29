import React from 'react';
import Player from './components/Typescript/Player/Player';
import { TouchRipple } from './components/Typescript/TouchRipple';
import Typography from './components/Typescript/Typography';

import './styles.scss';

const App: React.FC = () => {
  const rippleRef = React.useRef() as any;

  return (
    <>
      <div className="container">
        <Typography capitalize component={'h1'} className={'title'}>
          Efeito Ripple
        </Typography>
        <div
          className="btn"
          onMouseDown={(e) => {
            rippleRef?.current?.start(e);
          }}
          onMouseUp={(e) => {
            rippleRef?.current?.stop(e);
          }}
          onMouseLeave={(e) => {
            rippleRef?.current?.stop(e);
          }}
        >
          Botão
          <TouchRipple ref={rippleRef} />
        </div>

        <div className="wrapper-players">
          <Typography capitalize component={'h1'} className={'title'}>
            Vídeos
          </Typography>
          <Typography capitalize component={'h5'} className={'subtitle'}>
            Players do youtube. Os players não iram tocar juntos, no momento que
            um estiver rodando e clicar em outro vídeo, o anterior irá pausar. O
            primeiro player permite reposicionamento pelo site
          </Typography>
          <div className="players">
            <Player
              allowPositioning
              url={'https://www.youtube.com/watch?v=gHGZjv0_bdU'}
            />
            <Player url={'https://www.youtube.com/watch?v=Za2a7EPvvLQ'} />
            <Player
              url={'https://www.youtube.com/watch?v=sj56h8LuF90&t=10519s'}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
