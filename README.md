# react-wake-lock-toggle ☀️

[![Node.js CI](https://github.com/jg23497/react-wake-lock-toggle/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/jg23497/react-wake-lock-toggle/actions/workflows/node.js.yml)

A toggle slider React component that utilises the [Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Wake_Lock_API) to prevent the screen from dimming or locking. This can be useful for applications where continuous screen visibility is
important, such as presentations, reading interfaces, or interactive displays.

![Dark mode - on](doc/images/dark-on.png)
![Dark mode - off](doc/images/dark-off.png)

![Light mode - on](doc/images/light-off.png)
![Light mode - off](doc/images/light-on.png)

## Features

* Lightweight with minimal dependencies.
* Accessible (tested with screenreaders, usable via the keyboard).
* Plug and play — preconfigured and styled.

## Installation

You can install `react-wake-lock-toggle` using npm:

```bash
npm install @jgulan/react-wake-lock-toggle
```

## Usage

Import the WakeLock component into your React application and use it like any other component, for example:

```jsx
import React from "react";

import WakeLockToggle from "@jgulan/react-wake-lock-toggle";
import '@jgulan/react-wake-lock-toggle/dist/style.css';

function App() {
  return (
    <div>
      <h1>My Awesome Application</h1>
      <WakeLockToggle label="Prevent screen timeout" />
    </div>
  );
}

export default App;
```

### Customisation

This component is preconfigured and takes an opinionated stance on styling and behaviour. If you require further control and
customisation, please check out alternatives like [react-screen-wake-lock](https://www.npmjs.com/package/react-screen-wake-lock).

#### Label and control ordering

The default behaviour follows conventions, but if you would prefer the label text to be placed after the control, add the following CSS rule:

```css
#wake-lock-label {
  flex-direction: row-reverse;
}
```

#### Internationalisation

Set the required label text via the `label` prop according to preference or the user's locale.

The component respects left-to-right (LTR) and right-to-left (RTL, e.g. Arabic, Hebrew) ordering for different languages.
For example, using the [`dir` global attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/dir):

```jsx
<div dir="rtl">
  <WakeLockToggle label="اسکرین آن رکھیں" />
</div>
```

![Rendering RTL](doc/images/rtl.png)

## Browser support

The Wake Lock API is a relatively new feature and may not be supported by older browsers. If the feature is not supported, the
component will not render. You can check the current browser compatibility on [Caniuse.com](https://caniuse.com/mdn-api_wakelock).

## Development

Run the unit tests:

```
npm run test
```

Publish a new version to the public registry:

```
npm publish --access public
```

## License

ISC (see [LICENSE](./LICENSE)).
