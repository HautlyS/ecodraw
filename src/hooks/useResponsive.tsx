import { useState, useEffect } from 'react';

// Enhanced responsive breakpoints with better large screen support
const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1920,
  '4xl': 2560,
} as const;

type Breakpoint = keyof typeof breakpoints;

interface ResponsiveValues {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  isUltraWide: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
  currentBreakpoint: Breakpoint;
  isTouch: boolean;
  aspectRatio: number;
  devicePixelRatio: number;
  isHighDensity: boolean;
}

export function useResponsive(): ResponsiveValues {
  const [values, setValues] = useState<ResponsiveValues>(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isLargeDesktop: false,
        isUltraWide: false,
        screenWidth: 1024,
        screenHeight: 768,
        orientation: 'landscape',
        currentBreakpoint: 'lg',
        isTouch: false,
        aspectRatio: 1.33,
        devicePixelRatio: 1,
        isHighDensity: false,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    return {
      isMobile: width < breakpoints.md,
      isTablet: width >= breakpoints.md && width < breakpoints.lg,
      isDesktop: width >= breakpoints.lg && width < breakpoints['3xl'],
      isLargeDesktop: width >= breakpoints['3xl'] && width < breakpoints['4xl'],
      isUltraWide: width >= breakpoints['4xl'],
      screenWidth: width,
      screenHeight: height,
      orientation: width > height ? 'landscape' : 'portrait',
      currentBreakpoint: getCurrentBreakpoint(width),
      isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      aspectRatio,
      devicePixelRatio,
      isHighDensity: devicePixelRatio > 1.5,
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspectRatio = width / height;
      const devicePixelRatio = window.devicePixelRatio || 1;
      
      setValues({
        isMobile: width < breakpoints.md,
        isTablet: width >= breakpoints.md && width < breakpoints.lg,
        isDesktop: width >= breakpoints.lg && width < breakpoints['3xl'],
        isLargeDesktop: width >= breakpoints['3xl'] && width < breakpoints['4xl'],
        isUltraWide: width >= breakpoints['4xl'],
        screenWidth: width,
        screenHeight: height,
        orientation: width > height ? 'landscape' : 'portrait',
        currentBreakpoint: getCurrentBreakpoint(width),
        isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        aspectRatio,
        devicePixelRatio,
        isHighDensity: devicePixelRatio > 1.5,
      });
    };

    const handleOrientationChange = () => {
      // Delay to ensure viewport has updated
      setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Handle dynamic viewport height changes on mobile
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', setVH);
    };
  }, []);

  return values;
}

function getCurrentBreakpoint(width: number): Breakpoint {
  if (width >= breakpoints['4xl']) return '4xl';
  if (width >= breakpoints['3xl']) return '3xl';
  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
}

// Hook for checking specific breakpoints
export function useBreakpoint(breakpoint: Breakpoint): boolean {
  const { currentBreakpoint } = useResponsive();
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
  
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
  const targetIndex = breakpointOrder.indexOf(breakpoint);
  
  return currentIndex >= targetIndex;
}

// Hook for viewport-aware sizing
export function useViewportSize() {
  const [size, setSize] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
    vw: typeof window !== 'undefined' ? window.innerWidth / 100 : 10.24,
    vh: typeof window !== 'undefined' ? window.innerHeight / 100 : 7.68,
  }));

  useEffect(() => {
    const updateSize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
        vw: window.innerWidth / 100,
        vh: window.innerHeight / 100,
      });
    };

    window.addEventListener('resize', updateSize);
    window.addEventListener('orientationchange', updateSize);
    
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('orientationchange', updateSize);
    };
  }, []);

  return size;
}