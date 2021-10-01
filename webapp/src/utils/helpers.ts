import { format } from 'date-fns';

const dateFormats: { [key: string]: string } = {
  month: 'MM/yy',
  day: 'dd/MM/yy',
  hour: 'dd/MM/yy, HH:mm',
};

export function formatDate(date: string | Date, formatStr = 'hour') {
  return format(new Date(date), dateFormats[formatStr] || dateFormats['hour']);
}

const twoDigits = (n: number) => (n < 10 ? `0${n}` : n);

export const formatEpisodeNumber = (video: { series: number; episodeNumber: number }) =>
  `S${twoDigits(video.series)}E${twoDigits(video.episodeNumber)}`;
