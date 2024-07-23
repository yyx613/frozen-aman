// TODO: write documentation for colors and palette in own markdown file and add links from here

const palette = {
  neutral100: "#FFFFFF",
  neutral200: "#F4F2F1",
  neutral300: "#D7CEC9",
  neutral400: "#B6ACA6",
  neutral500: "#978F8A",
  neutral600: "#564E4A",
  neutral700: "#3C3836",
  neutral800: "#191015",
  neutral900: "#000000",


  primary100: "#F4E0D9",
  primary200: "#E8C1B4",
  primary300: "#DDA28E",
  primary400: "#fdd7ad",
  primary500: "#cb8454",
  primary600: "#a56a43",

  secondary100: "#fff4e0",
  secondary200: "#ACB8D6",
  secondary300: "#d69161",
  secondary400: "#626894",
  secondary500: "#88A1C8",

  accent100: "#FFEED4",
  accent200: "#FFE1B2",
  accent300: "#FDD495",
  accent400: "#FBC878",
  accent500: "#FFBB50",

  angry100: "#F2D6CD",
  angry500: "#C03403",

  purple: '#8676FE',
  mintGreen: '#1AB0B0',
  orange: '#FF7443',
  pink: '#FA5A7D',
  green: '#27B05E',

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",
} as const

const tag = {
  default: {
    primary: palette.primary500,
    secondary: palette.secondary200,
  },
  yellow: {
    primary: '#E48D2A',
    secondary: '#FFFFF7',
  },
  red: {
    primary: '#C43A40',
    secondary: '#FFF7F7',
  },
  grey: {
    primary: '#666',
    secondary: '#F7F7F7',
  },
  green: {
    primary: '#27B05E',
    secondary: '#F7FFF7',
  },
  blue: {
    primary: '#2779CA',
    secondary: '#F7FBFF',
  },
};


export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  text: palette.primary600,
  /**
   * Secondary text information.
   */
  textDim: palette.neutral600,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral200,
  /**
   * The default border color.
   */
  border: palette.neutral400,
  /**
   * The main tinting color.
   */
  tint: palette.primary500,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Error messages.
   */
  error: palette.angry500,
  /**
   * Error Background.
   *
   */
  errorBackground: palette.angry100,
  /**
   * Tag color.
   *
   */
  tag
}
