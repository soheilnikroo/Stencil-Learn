import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'SoheilWC',
  outputTargets: [
    {
      type: 'dist',
    },
    // {
    //   type: 'www',
    //   serviceWorker: null, // disable service workers
    // },
  ],
};
