const noop = async () => {};
export const FFmpegKit = {execute: noop, cancel: noop};
export const FFmpegKitConfig = {enableLogCallback: noop};
export const ReturnCode = {isSuccess: () => false};
export default {FFmpegKit, FFmpegKitConfig, ReturnCode};
