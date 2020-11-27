const noop = (): void => {
  /*empty by design*/
};

const duration = (time: number): string => {
  const hrs = ~~(time / 3600);
  let mins = (~~((time % 3600) / 60)).toString(10);
  let secs = (~~time % 60).toString(10);
  mins = ("0" + mins).substr(-2);
  secs = ("0" + secs).substr(-2);
  let result = `${mins}:${secs}`;
  if (hrs > 0) {
    result = `${hrs}:${result}`;
  }
  return result;
};

const salt = (): string => {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < 20; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
const shuffle = (a: unknown[]): unknown[] => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

interface getArtistUrlSignature {
  artistId: number;
  id: number;
  artist: string;
  name: string;
}
const getArtistUrl = ({
  artistId,
  id,
  artist,
  name,
}: getArtistUrlSignature): string | undefined => {
  if (artistId || id) {
    const aId = artistId || id;
    let artistName = artist || name;
    artistName = encodeURIComponent(artistName.split(" ").join("-"));
    return `/library/artists/${aId}/${artistName}`;
  }
  return undefined;
};

export { noop, duration, salt, shuffle, getArtistUrl };
