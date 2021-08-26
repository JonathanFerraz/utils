export function getYoutubeId(url: string) {
  if (typeof url !== 'string') {
    throw new Error('Error: getYoutubeId(string) expects a string argument.');
  }

  let regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  let match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : false;
}

export function getYoutubeThumb(url: string) {
  let video, results;

  let getThumb = function (url: string) {
    if (url === null) {
      return '';
    }

    results = url.match('[\\?&]v=([^&#]*)');
    video = results === null ? url : results[1];

    return 'http://img.youtube.com/vi/' + video + '/maxresdefault.jpg';
  };

  return getThumb(url);
}
