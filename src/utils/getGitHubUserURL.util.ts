export const getGitHubUserURL = (url: string): string => `${url.split('/').slice(0, 4).join('/')}`;