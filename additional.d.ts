declare module '*.svg' {
  const content: React.FC<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module '*.png' {
  const image: string;
  export default image;
}

declare module '*.jpg' {
  const image: string;
  export default image;
}

declare module '*.jpeg' {
  const image: string;
  export default image;
}

declare module '*.webp' {
  const image: string;
  export default image;
}
