import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark'

const theme = ref<Theme>('light')
const isDark = ref(false)

// Load theme from localStorage
const loadTheme = () => {
  const savedTheme = localStorage.getItem('theme') as Theme | null
  if (savedTheme) {
    theme.value = savedTheme
  } else {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    theme.value = prefersDark ? 'dark' : 'light'
  }
  isDark.value = theme.value === 'dark'
  applyTheme()
}

// Apply theme to document
const applyTheme = () => {
  const html = document.documentElement
  const body = document.body

  if (theme.value === 'dark') {
    html.classList.add('dark')
    body.classList.add('dark')
  } else {
    html.classList.remove('dark')
    body.classList.remove('dark')
  }
}

// Toggle theme
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  isDark.value = theme.value === 'dark'
  localStorage.setItem('theme', theme.value)
  applyTheme()
}

// Set specific theme
const setTheme = (newTheme: Theme) => {
  theme.value = newTheme
  isDark.value = newTheme === 'dark'
  localStorage.setItem('theme', newTheme)
  applyTheme()
}

// Watch for theme changes
watch(theme, () => {
  applyTheme()
})

export function useTheme() {
  return {
    theme,
    isDark,
    toggleTheme,
    setTheme,
    loadTheme,
  }
}
