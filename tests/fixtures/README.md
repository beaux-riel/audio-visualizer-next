# Test Fixtures

This directory contains test fixtures for E2E testing.

## Audio Testing

For audio visualizer E2E tests, Playwright will use fake audio devices configured in the browser launch options. The fake audio stream simulates microphone input for testing purposes.

The tests use Chrome's fake media stream features:

- `--use-fake-ui-for-media-stream`: Automatically grants media permissions
- `--use-fake-device-for-media-stream`: Uses a fake audio/video device
- Fake audio generates sine wave tones that the visualizer can process

No actual audio files are needed as the browser generates synthetic audio data for testing.
