interface VideoInfo {
  mediaType: string;
  id: string;
  provider: string;
}

interface ParserResult extends VideoInfo {
  list?: string;
  params?: any;
}

interface CreateProps {
  videoInfo: VideoInfo;
  format: string;
  params?: any;
}

declare module 'js-video-url-parser' {
  export function parse(url: string): ParserResult;
  export function create(props: CreateProps): string;
}
