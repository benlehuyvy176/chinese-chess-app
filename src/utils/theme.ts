/**
 * Theme system for Chinese Chess application
 */

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

export interface BoardTheme {
  backgroundColor: string;
  lineColor: string;
  riverColor: string;
  selectedSquare: string;
  validMoveSquare: string;
  lastMoveSquare: string;
  checkSquare: string;
}

export interface PieceTheme {
  red: {
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    selectedBorderColor: string;
  };
  black: {
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    selectedBorderColor: string;
  };
}

export interface Theme {
  colors: ColorScheme;
  board: BoardTheme;
  pieces: PieceTheme;
  typography: {
    h1: {
      fontSize: number;
      fontWeight: string;
    };
    h2: {
      fontSize: number;
      fontWeight: string;
    };
    body: {
      fontSize: number;
      fontWeight: string;
    };
    caption: {
      fontSize: number;
      fontWeight: string;
    };
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  shadows: {
    sm: {
      elevation: number;
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
    };
    md: {
      elevation: number;
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
    };
    lg: {
      elevation: number;
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
    };
  };
}

/**
 * Default (Classic) Theme - Traditional Chinese Chess appearance
 */
export const classicTheme: Theme = {
  colors: {
    primary: '#8B4513', // Saddle Brown
    secondary: '#DEB887', // Burlywood
    accent: '#FFD700', // Gold
    background: '#F5DEB3', // Wheat
    surface: '#FFFFFF', // White
    text: '#2F2F2F', // Dark Gray
    textSecondary: '#666666', // Medium Gray
    border: '#D2B48C', // Tan
    error: '#DC143C', // Crimson
    warning: '#FF8C00', // Dark Orange
    success: '#32CD32', // Lime Green
    info: '#4169E1', // Royal Blue
  },
  board: {
    backgroundColor: '#F5DEB3', // Wheat
    lineColor: '#8B4513', // Saddle Brown
    riverColor: '#4169E1', // Royal Blue
    selectedSquare: 'rgba(255, 215, 0, 0.4)', // Gold with opacity
    validMoveSquare: 'rgba(50, 205, 50, 0.3)', // Lime Green with opacity
    lastMoveSquare: 'rgba(255, 255, 0, 0.3)', // Yellow with opacity
    checkSquare: 'rgba(220, 20, 60, 0.4)', // Crimson with opacity
  },
  pieces: {
    red: {
      backgroundColor: '#F5F5DC', // Beige
      textColor: '#DC143C', // Crimson
      borderColor: '#8B0000', // Dark Red
      selectedBorderColor: '#FFD700', // Gold
    },
    black: {
      backgroundColor: '#F5F5DC', // Beige
      textColor: '#000000', // Black
      borderColor: '#2F2F2F', // Dark Gray
      selectedBorderColor: '#FFD700', // Gold
    },
  },
  typography: {
    h1: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    h2: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal',
    },
    caption: {
      fontSize: 14,
      fontWeight: 'normal',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  shadows: {
    sm: {
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
    },
    md: {
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    lg: {
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
    },
  },
};

/**
 * Modern Theme - Contemporary appearance with cooler colors
 */
export const modernTheme: Theme = {
  ...classicTheme,
  colors: {
    ...classicTheme.colors,
    primary: '#2C3E50', // Dark Blue Gray
    secondary: '#34495E', // Blue Gray
    accent: '#3498DB', // Blue
    background: '#ECF0F1', // Light Gray
    surface: '#FFFFFF', // White
  },
  board: {
    ...classicTheme.board,
    backgroundColor: '#ECF0F1', // Light Gray
    lineColor: '#2C3E50', // Dark Blue Gray
    riverColor: '#3498DB', // Blue
  },
  pieces: {
    red: {
      backgroundColor: '#E8F4F8',
      textColor: '#E74C3C', // Red
      borderColor: '#C0392B', // Dark Red
      selectedBorderColor: '#3498DB', // Blue
    },
    black: {
      backgroundColor: '#E8F4F8',
      textColor: '#2C3E50', // Dark Blue Gray
      borderColor: '#34495E', // Blue Gray
      selectedBorderColor: '#3498DB', // Blue
    },
  },
};

/**
 * Minimal Theme - Clean and simple appearance
 */
export const minimalTheme: Theme = {
  ...classicTheme,
  colors: {
    ...classicTheme.colors,
    primary: '#333333', // Dark Gray
    secondary: '#666666', // Medium Gray
    accent: '#000000', // Black
    background: '#FFFFFF', // White
    surface: '#F8F8F8', // Very Light Gray
  },
  board: {
    ...classicTheme.board,
    backgroundColor: '#FFFFFF', // White
    lineColor: '#333333', // Dark Gray
    riverColor: '#666666', // Medium Gray
  },
  pieces: {
    red: {
      backgroundColor: '#FFFFFF',
      textColor: '#FF0000', // Pure Red
      borderColor: '#CCCCCC', // Light Gray
      selectedBorderColor: '#000000', // Black
    },
    black: {
      backgroundColor: '#FFFFFF',
      textColor: '#000000', // Black
      borderColor: '#CCCCCC', // Light Gray
      selectedBorderColor: '#000000', // Black
    },
  },
};

/**
 * Theme variants
 */
export const themes = {
  classic: classicTheme,
  modern: modernTheme,
  minimal: minimalTheme,
} as const;

export type ThemeName = keyof typeof themes;

/**
 * Default theme
 */
export const defaultTheme = classicTheme;