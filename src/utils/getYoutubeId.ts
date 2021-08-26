export default function getYoutubeId(url: string) {
  if (typeof url !== 'string') {
    throw new Error('Error: getYoutubeId(string) expects a string argument.');
  }

  let regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  let match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : false;
}
