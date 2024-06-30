## What is this?

This is a project inspired in [Remotion](https://github.com/remotion-dev/remotion#), but entirely rewritten in SolidJS.

## Why create videos in ~~React~~ SolidJS?

- **Leverage web technologies**: Use all of CSS, Canvas, SVG, WebGL, etc.
- **Leverage programming**: Use variables, functions, APIs, math and algorithms to create new effects
- **Leverage ~~React~~ SolidJS**: Reusable components, Powerful composition, Fast Refresh, Package ecosystem

## How to get started

- Clone this repo
- `pnpm install`
- KEEP READING!

This project relies on [Puppeteer ](https://pptr.dev/) to generate screenshots of your composition, and [ffmpeg](https://www.ffmpeg.org/) to create a video from these screenshots. Using Puppeteer just for taking screenshots might be an overkill which I will probably address in the future.

To install `ffmpeg` on Ubuntu or other Debian-based distro (I did it in WSL):
- `sudo apt update && sudo apt install ffmpeg`

Next, Puppeteer needs a browser to connect to during the rendering. This project depends on `puppeteer-core`, which does not include the browser binaries. Make sure you have a dev-compatible browser installed on your environment. I've used Chrome for WSL. You can find the instructions on how to install Chrome in Linux [here](https://learn.microsoft.com/en-us/windows/wsl/tutorials/gui-apps#install-google-chrome-for-linux).

Finally, start having fun! You can find some examples in the `examples` directory.

To render a composition:

```console
pnpm run render
```

