import { computed } from 'vue'
import { useTheme } from './useTheme'

export interface ThemeColors {
  // Backgrounds
  bg: {
    primary: string
    secondary: string
    tertiary: string
    hover: string
    active: string
  }

  // Text
  text: {
    primary: string
    secondary: string
    tertiary: string
    inverse: string
  }

  // Borders
  border: {
    primary: string
    secondary: string
    focus: string
  }

  // Accent Colors (Golden/Amber)
  accent: {
    primary: string
    secondary: string
    hover: string
    light: string
    dark: string
  }

  // Status Colors
  status: {
    success: string
    warning: string
    error: string
    info: string
  }

  // Element Colors
  element: {
    plant: string
    terrain: string
    structure: string
  }
}

export function useThemeColors() {
  const { isDark } = useTheme()

  const colors = computed<ThemeColors>(() => {
    if (isDark.value) {
      // Dark Mode - AMOLED Black with Golden Accents
      return {
        bg: {
          primary: 'bg-black',
          secondary: 'bg-gray-950',
          tertiary: 'bg-gray-900',
          hover: 'hover:bg-gray-900',
          active: 'bg-gray-800',
        },
        text: {
          primary: 'text-white',
          secondary: 'text-gray-300',
          tertiary: 'text-gray-400',
          inverse: 'text-black',
        },
        border: {
          primary: 'border-gray-800',
          secondary: 'border-gray-700',
          focus: 'border-amber-500',
        },
        accent: {
          primary: 'bg-amber-600 text-white',
          secondary: 'bg-amber-700 text-white',
          hover: 'hover:bg-amber-700',
          light: 'bg-amber-950 text-amber-400',
          dark: 'bg-amber-900 text-amber-300',
        },
        status: {
          success: 'text-green-500',
          warning: 'text-amber-500',
          error: 'text-red-500',
          info: 'text-blue-500',
        },
        element: {
          plant: 'text-green-500 bg-green-950 border-green-600',
          terrain: 'text-orange-500 bg-orange-950 border-orange-600',
          structure: 'text-blue-500 bg-blue-950 border-blue-600',
        },
      }
    } else {
      // Light Mode - White with Golden Accents
      return {
        bg: {
          primary: 'bg-white',
          secondary: 'bg-gray-50',
          tertiary: 'bg-gray-100',
          hover: 'hover:bg-gray-50',
          active: 'bg-gray-100',
        },
        text: {
          primary: 'text-gray-900',
          secondary: 'text-gray-700',
          tertiary: 'text-gray-500',
          inverse: 'text-white',
        },
        border: {
          primary: 'border-gray-200',
          secondary: 'border-gray-300',
          focus: 'border-amber-500',
        },
        accent: {
          primary: 'bg-amber-600 text-white',
          secondary: 'bg-amber-700 text-white',
          hover: 'hover:bg-amber-700',
          light: 'bg-amber-50 text-amber-700',
          dark: 'bg-amber-100 text-amber-800',
        },
        status: {
          success: 'text-green-600',
          warning: 'text-amber-600',
          error: 'text-red-600',
          info: 'text-blue-600',
        },
        element: {
          plant: 'text-green-600 bg-green-50 border-green-500',
          terrain: 'text-orange-600 bg-orange-50 border-orange-500',
          structure: 'text-blue-600 bg-blue-50 border-blue-500',
        },
      }
    }
  })

  return {
    colors,
    isDark,
  }
}
