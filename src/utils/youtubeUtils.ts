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
  if (typeof url !== 'string') {
    throw new Error(
      'Error: getYoutubeThumb(string) expects a string argument.'
    );
  }

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

export function getUniqueKey(): string {
  let keys: string[] = [];
  let newKey =
    '__' + String(String(Math.random() * 9999) + String(new Date().getTime()));
  newKey = newKey.split('.').join('');
  if (keys.indexOf(newKey) === -1) {
    keys.push(newKey);
    return newKey;
  }
  return getUniqueKey();
}
