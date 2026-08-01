export const configuration = () => ({
  app: {
    port: 5000,
  },
  innerTube: {
    generateSessionLocally: true,
  },
});

export type ApiCoreConfig = ReturnType<typeof configuration>;
