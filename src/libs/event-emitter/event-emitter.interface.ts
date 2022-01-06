export type Events = {
  [key: string]: Array<(ctx?: any) => void>;
};
