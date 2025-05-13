// filepath: /home/oskari/Desktop/fiTracker/declarations.d.ts
declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.jpg' {
  const value: any;
  export default value;
}

declare module '*.jpeg' {
  const value: any;
  export default value;
}

declare module '*.gif' {
  const value: any;
  export default value;
}

// Jos käytät SVG-tiedostoja importtaamalla niitä suoraan (ei SvgXml-komponentilla)
// ja olet asentanut react-native-svg-transformer:
declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}