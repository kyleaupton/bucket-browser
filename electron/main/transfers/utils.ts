export const prettyEta = (eta: number) => {
  const h = Math.floor(eta / 3600)
    .toString()
    .padStart(2, '0');

  const m = Math.floor((eta % 3600) / 60)
    .toString()
    .padStart(2, '0');

  const s = Math.floor(eta % 60)
    .toString()
    .padStart(2, '0');

  return h !== '00' ? `${h}:${m}:${s}` : `${m}:${s}`;
};
