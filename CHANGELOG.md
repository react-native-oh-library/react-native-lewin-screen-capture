# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0-beta.1] - 2026-10-26

### Added

- Completed the HarmonyOS (RNOH) adaptation of react-native-lewin-screen-capture: implemented all 4 APIs (`startListener` / `stopListener` / `screenCapture` / `clearCache`) based on TurboModule.
- Added the `Example/harmony/build-profile.template.json5` template, whose modules include `entry` and `lewin_screen_capture` (srcPath pointing to `../../harmony/lewin_screen_capture`).
- Integrated the RNOH Testerino test page into the Example, covering all 4 APIs: `startListener` / `stopListener` / `screenCapture` / `clearCache`.

### Changed

- Aligned the library side with the `harmony.autolinking` configuration in `package.json`: the HAR package name was confirmed as `@react-native-ohos/react-native-lewin-screen-capture`, and the CMake target was renamed from `lewin_screen_capture` to `rnoh_lewin_screen_capture`; the Example now consumes it via autolink.
- Integrated Autolink into the Example following the 0.84 reference project: upgraded `react-native` from `0.72.5` to `0.84.1`, and `@react-native-oh/react-native-harmony` from `0.72.139` to `0.84.2`.
- Consolidated the library HAR dependency in `Example/harmony/oh-package.json5`; `Example/harmony/entry/oh-package.json5` now keeps only `@rnoh/react-native-openharmony`; the RN SDK HAR path changed from `react_native_openharmony_release.har` to `react_native_openharmony.har`.
- The root `Example/harmony/hvigorfile.ts` now only exports `appTasks`; `entry/hvigorfile.ts` enables `createRNOHModulePlugin({ nodeModulesPath: '../node_modules', codegen: null, autolinking: {} })`.
- Upgraded `@rnoh/hvigor-plugin` in `Example/harmony/hvigor/hvigor-config.json5` from `rnoh-hvigor-plugin-0.3.0.tgz` to `rnoh-hvigor-plugin-0.84.2.tgz`.
- Refactored the Example C++ side to the 0.84 host CMake: introduced `OH_MODULES_DIR` / `OH_MODULES` / `OH_MODULE_DIR`, included `autolinking.cmake`, and called `autolink_libraries(rnoh_app)`.
- `PackageProvider.cpp` now includes `RNOHGeneratedPackage`, first going through `createRNOHPackages(ctx)` and then merging `ManualLinkingPackage`.
- The ETS-side `RNPackagesFactory.ets` now delegates to `createRNOHPackagesAutolinking(ctx)`.
- Adjusted the `Example/package.json` scripts to `codegen` / `pack:pkg` / `install:pkg` / `dev` / `prod` / `postinstall`.
- Aligned `Example/harmony/build-profile.json5` with the template structure while keeping the original signingConfigs, and added the `lewin_screen_capture` module.
- Switched the Example entry from `App.tsx` (appKey `AwesomeProject`) to the Testerino page.

### Removed

- Removed the manual registration of `LewinScreenCapturePackage` on both the C++ and ETS sides; it is now integrated via autolinking (`createRNOHPackages` / `createRNOHPackagesAutolinking`).

### Fixed

- Fixed the inconsistency between the `name` in `Example/app.json` and the appKey in `Index.ets`, unified as `app_name`.
