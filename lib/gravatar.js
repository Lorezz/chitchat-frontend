import md5 from 'md5';

export const getGravatarUrl = (email) => {
  if (!email) return;
  const hash = md5(email);
  const picUrl = `https://www.gravatar.com/avatar/${hash}?s=80&d=retro`;
  return picUrl;
};
