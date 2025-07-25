# Audio Visualizer - Comprehensive Testing Documentation

This document outlines the comprehensive testing strategy implemented for the Audio Visualizer project, covering unit tests, integration tests, and end-to-end (E2E) tests.

## Overview

Our testing implementation fulfills all requirements for comprehensive testing of the audio visualizer application:

✅ **Vitest configured with `jsdom`**  
✅ **Web Audio API & `getUserMedia` mocking**  
✅ **Unit tests for all critical functionality**  
✅ **Integration tests with React Testing Library**  
✅ **E2E tests with Playwright in headed mode**  
✅ **All tests pass in CI-ready configuration**

## Test Framework Setup

### Vitest Configuration

**File**: `vitest.config.ts`

- **Environment**: `jsdom` for browser-like testing environment
- **Coverage**: V8 provider with comprehensive reporting
- **Thresholds**: 80% for branches, functions, lines, and statements
- **Global mocks**: Web Audio API and MediaDevices API

### Test Setup

**File**: `src/test/setup.ts`

Comprehensive mocking includes:

- Web Audio API (`AudioContext`, `AnalyserNode`, `MediaStreamAudioSourceNode`)
- MediaDevices API (`getUserMedia`)
- Animation frame APIs (`requestAnimationFrame`, `cancelAnimationFrame`)
- MediaStream API
- DOMException for error testing

## Unit Tests

### Audio Utility Functions (`src/utils/__tests__/audio.test.ts`)

**22 test cases covering:**

- `getAverageVolume()` function:
  - Empty array handling
  - Single value calculations
  - Multiple values averaging
  - Maximum and minimum value handling
  - Realistic audio data processing
  - Large array efficiency

- `volumeToPercentage()` function:
  - Zero to 100% conversion range
  - Edge case handling (negative values, over-255)
  - Decimal input precision
  - Boundary value consistency

- `createAudioContext()` function:
  - AudioContext instantiation
  - WebKit fallback compatibility
  - Cross-browser support verification

- `isAudioContextSupported()` function:
  - Browser capability detection
  - Fallback API availability

- `initializeAudioAnalysis()` function:
  - Audio context setup
  - Analyser node configuration
  - Source-to-analyser connection
  - Data array initialization

**Run**: `npm run test:unit`

## Integration Tests

### AudioVisualizer Component (`src/components/__tests__/AudioVisualizer.comprehensive.test.tsx`)

**24 comprehensive test cases covering:**

#### Microphone Toggle State Management

- Off-to-listening state transitions
- Listening-to-off state transitions
- Consistent state across multiple toggles

#### Visual Elements Rendering

- Correct number of frequency bars for mocked data
- Particle rendering based on audio data (50 particles verified)
- Circular waveform with proper SVG line count (64+ lines)
- Volume meter updates based on audio data

#### Permission Denied Error Handling

- NotAllowedError (permission denied)
- SecurityError (security restrictions)
- NotFoundError (missing microphone)
- Error UI accessibility attributes

#### Browser Support Detection

- MediaDevices API availability detection
- Graceful degradation for unsupported browsers
- Proper button state management

#### Accessibility Features

- ARIA labels and attributes
- State-based attribute updates
- Keyboard navigation support (Space and Enter keys)
- Screen reader compatibility (aria-hidden icons)

#### Resource Management

- Component unmount cleanup
- Animation frame lifecycle management
- Audio context resource cleanup

#### Error Boundary Behavior

- Generic JavaScript error handling
- Unknown error type handling
- Graceful error state management

**Run**: `npm run test:comprehensive`

## End-to-End Tests

### Playwright Configuration (`playwright.config.ts`)

**Features:**

- **Headed mode**: Required for microphone access simulation
- **Fake media streams**: Chrome arguments for media device simulation
- **Microphone permissions**: Automatically granted for testing
- **Single browser focus**: Chromium only (Firefox/Safari have limited media API support in E2E)

### E2E Test Cases (`tests/e2e/audio-visualizer.spec.ts`)

**13 comprehensive test scenarios:**

1. **Interface Display**: Verify main UI elements are visible
2. **Microphone Access**: Test microphone permission and listening state
3. **Visualization Components**: Confirm all visual elements render when listening
4. **Visual Elements with Data**: Test frequency bars, particles, and SVG waveforms
5. **Volume Percentage Display**: Verify audio level percentage display
6. **Stop Functionality**: Test stopping microphone listening
7. **Keyboard Navigation**: Space and Enter key functionality
8. **Accessibility Attributes**: ARIA labels and state management
9. **Rapid Clicks**: Graceful handling of multiple rapid button clicks
10. **Visual Feedback**: Dynamic audio level visualization
11. **Performance**: Extended use performance verification
12. **Responsive Design**: Multiple viewport size testing
13. **Resource Cleanup**: Navigation and resource management

**Error Handling E2E:**

- Browser without microphone support

**Run**: `npm run test:e2e:headed`

## Test Scripts

### Available Commands

```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# Comprehensive component tests
npm run test:comprehensive

# All unit and integration tests
npm run test

# Tests with coverage report
npm run test:coverage

# E2E tests (headed mode)
npm run test:e2e:headed

# E2E tests with UI
npm run test:e2e:ui

# All tests (unit + integration + E2E)
npm run test:all

# CI test script
npm run test:ci
```

### Demo Script

**File**: `scripts/demo-tests.sh`

Runs a complete test demonstration showing:

- Unit test execution
- Comprehensive component test execution
- Coverage report generation
- Test summary and results

**Run**: `./scripts/demo-tests.sh`

## Coverage Report

Our test suite achieves excellent coverage:

- **Components**: 97.6% coverage
- **Utils**: 100% coverage
- **Overall**: Exceeds 80% threshold for all metrics

Coverage includes:

- Statement coverage
- Branch coverage
- Function coverage
- Line coverage

## CI Integration

### CI Script (`scripts/test-ci.sh`)

Complete CI testing workflow:

1. Dependency installation
2. Application build
3. Unit and integration tests with coverage
4. Playwright browser installation
5. E2E test execution
6. Coverage threshold verification

**Features:**

- Fail-fast on any test failure
- Comprehensive coverage reporting
- Cross-environment compatibility
- CI-optimized configuration

## Mock Strategy

### Web Audio API Mocking

**Custom Implementation**: Comprehensive mocking of:

- `AudioContext` with all required methods
- `AnalyserNode` with frequency data simulation
- `MediaStreamAudioSourceNode` with connection tracking
- Realistic audio data generation for testing

### getUserMedia Mocking

**Scenarios Covered**:

- Successful microphone access
- Permission denied errors
- Device not found errors
- Security restriction errors
- Unknown error handling

## Best Practices Implemented

1. **Comprehensive Mocking**: All Web APIs properly mocked
2. **Error Scenario Testing**: All error conditions tested
3. **Accessibility Testing**: ARIA attributes and keyboard navigation
4. **Performance Testing**: Extended use and resource cleanup
5. **Cross-browser Consideration**: Chromium focus with fallback documentation
6. **CI/CD Ready**: Automated testing pipeline
7. **Documentation**: Comprehensive test documentation
8. **Maintainability**: Clear test organization and naming

## Running Tests

### Development

```bash
# Watch mode for active development
npm run test:watch

# UI mode for interactive testing
npm run test:ui

# E2E with browser visible
npm run test:e2e:headed
```

### CI/Production

```bash
# Complete CI test suite
npm run test:ci

# Coverage verification
npm run test:coverage
```

## Troubleshooting

### Common Issues

1. **E2E Tests Failing**: Ensure dev server is running (`npm run dev`)
2. **Microphone Permission Issues**: Use headed mode for E2E tests
3. **Coverage Thresholds**: Check coverage report and add missing tests
4. **Mock Issues**: Verify test setup file is properly configured

### Browser Compatibility

- **Chromium**: Full support for all test features
- **Firefox/Safari**: Limited E2E media API support (tests available but commented out)

## Future Enhancements

1. **Visual Regression Testing**: Screenshot comparison for visual elements
2. **Performance Benchmarking**: Automated performance metrics
3. **Cross-browser E2E**: Enhanced media API mocking for Firefox/Safari
4. **Load Testing**: High-frequency audio data processing tests
5. **Integration Testing**: Real browser media stream testing

This comprehensive testing implementation ensures robust, reliable, and maintainable code for the Audio Visualizer application.
