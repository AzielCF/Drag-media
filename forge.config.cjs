module.exports = {
  packagerConfig: {
    name: 'Drag media',
    asar: true,
    icon: './public/icon'
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
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    }
  ],
};
