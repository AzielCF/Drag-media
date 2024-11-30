module.exports = {
  packagerConfig: {
    name: 'Drag media',
    asar: {
      unpack: [ "**/node_modules/sharp/**/*",
        "**/node_modules/@img/**/*", 
        "**/node_modules/@ffmpeg-installer/**/*" ]
    },
    icon: './public/icon',
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        iconUrl: 'https://url/to/icon.ico',
        setupIcon: './public/windows/icon.ico'
      }
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: './public/linux/icon.png'
        }
      }
    }
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'AzielCF',
          name: 'Drag-media'
        },
        prerelease: true
      }
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    }
  ],
};
