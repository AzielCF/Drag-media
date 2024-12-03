import type { ForgeConfig } from '@electron-forge/shared-types';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import packageJson from './package.json';
import path from 'node:path';

const {
  name,
  productName,
  author,
  version
} = packageJson;

const config: ForgeConfig = {
  packagerConfig: {
    name: productName,
    asar: {
      // @ts-ignore
      unpack: [
        '**/node_modules/sharp/**/*',
        '**/node_modules/@img/**/*', 
        '**/node_modules/@ffmpeg-installer/**/*',
        '**/node_modules/node-notifier/**/*',
        '**/public/linux/*'
      ] 
    },
    icon: './public/icon',
    appBundleId: 'com.azielcf.dragmedia',
    win32metadata: {
      CompanyName: author,
      OriginalFilename: productName,
    }
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      config: (arch: string) => ({
        name: "Drag-Media",
        authors: author,
        iconUrl: 'https://res.cloudinary.com/dktwu41vm/image/upload/v1733168153/drag-media/fa4lcuf7tauryshnwg35.ico',
        setupIcon: path.resolve(__dirname, 'public', 'icon.ico'),
        loadingGif: path.resolve(__dirname, 'public', 'loading.gif'),
        setupExe: `${name}-${version}-${arch}-setup.exe`
      })
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: path.resolve(__dirname, 'public', 'icon.png')
        }
      }
    },
    {
      name: '@electron-forge/maker-zip',
      config: {
        icon: path.resolve(__dirname, 'public', 'icon.png')
      }
    }
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        authToken: process.env.GITHUB_TOKEN,
        repository: {
          owner: 'AzielCF',
          name: name
        },
        prerelease: true,
        draft: true,
        tagPrefix: '',
        generateReleaseNotes: true
      }
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    })
  ],
};

export default config;