> 文档模板：v0.4.2

<p align="center">
  <h1 align="center"> <code>react-native-lewin-screen-capture</code> </h1>
</p>

This project is developed based on [react-native-lewin-screen-capture](https://github.com/LewinJun/react-native-lewin-screen-capture).

The version mapping is as follows:

| Library Name    | Version (npm)    | Release     | Supported RN Version    | Autolink     | Compilation API Version     | Community Baseline Version    |  Source Code   |
| ------------ | ------------ | ------------------------------ | ------------- | ------------- |------------------------ | ------------- | ------------- |
| @react-native-ohos/react-native-lewin-screen-capture | [1.1.0 (in development)](https://www.npmjs.com/package/@react-native-ohos/react-native-lewin-screen-capture)    | [Github Releases](https://github.com/react-native-oh-library/react-native-lewin-screen-capture/releases) | 0.72.\*/0.77.\*/0.82.\*/0.84.\* | Yes | API12+ | 1.1.0 | [master](https://github.com/react-native-oh-library/react-native-lewin-screen-capture/tree/master) |

## Introduction

The react-native-lewin-screen-capture component is used with React Native.<br/>
It provides two core capabilities: listening for system screenshot events (`startListener`) and actively capturing the current screen (`screenCapture`). The screenshot result is returned via callback in the `{code, uri, base64}` structure, and clearing the screenshot cache (`clearCache`) is also supported.<br/>
It can be applied to scenarios such as screenshot sharing, page snapshot generation, and sensitive-content screenshot detection.

## Installation

Go to your project directory and run the following command:

**npm**

```bash
npm install @react-native-ohos/react-native-lewin-screen-capture
```

**yarn**

```bash
yarn add @react-native-ohos/react-native-lewin-screen-capture
```

## Link

|                                      | Autolink Supported | RN Framework Version |
|--------------------------------------|----------------|-----------|
| 1.1.0                                | Yes             |  0.72/0.77/0.82/0.84   |

Projects using AutoLink need to be configured according to this document. Autolink framework guide: https://gitcode.com/CPF-RN/ohos_react_native/blob/master/docs/zh-cn/Autolinking.md

If the version you are using supports Autolink and your project has integrated Autolink, you can skip the ManualLink configuration.
<details>
  <summary>ManualLink: guide for manually configuring native dependencies</summary>

First, open the HarmonyOS project `harmony` in your project with DevEco Studio.

### 1. Overrides RN SDK

To make the project depend on the same version of the RN SDK, add the `overrides` field to the `oh-package.json5` in the project root directory, pointing to the RN SDK version the project needs to use. The replacement version can be a specific version number, a fuzzy version, or a local HAR package or source code directory.

For the purpose of this field, please read the [official documentation](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/ide-oh-package-json5-V5#zh-cn_topic_0000001792256137_overrides)

```json
{
  "overrides": {
    "@rnoh/react-native-openharmony": "file:../node_modules/@react-native-oh/react-native-harmony/react_native_openharmony.har" // ohpm online version
    // "@rnoh/react-native-openharmony" : "./react_native_openharmony.har" // points to a local har package path
    // "@rnoh/react-native-openharmony" : "./react_native_openharmony" // points to a source code path
  }
}
```

### 2. Import the native code

There are currently two methods:

- Import via a har package;
- Link the source code directly.

Method 1: Import via a har package (recommended)

> [!TIP] The har package is located in the `harmony` folder of the third-party library installation path.

Open `entry/oh-package.json5` and add the following dependency:

```json
"dependencies": {
    "@react-native-ohos/react-native-lewin-screen-capture": "file:../../node_modules/@react-native-ohos/react-native-lewin-screen-capture/harmony/lewin_screen_capture.har"
  }
```

Click the `sync` button in the upper right corner

Or run in the command line terminal:

```bash
cd entry
ohpm install
```

Method 2: Link the source code directly

> [!TIP] To link the source code directly, please refer to the [Link Source Code Guide](https://gitcode.com/CPF-RN/usage-docs/blob/master/zh-cn/link-source-code.md)

### 3. Configure CMakeLists and import LewinScreenCapturePackage

Open `entry/src/main/cpp/CMakeLists.txt` and add:

```diff
project(rnapp)
cmake_minimum_required(VERSION 3.4.1)
set(CMAKE_SKIP_BUILD_RPATH TRUE)
set(RNOH_APP_DIR "${CMAKE_CURRENT_SOURCE_DIR}")
set(NODE_MODULES "${CMAKE_CURRENT_SOURCE_DIR}/../../../../../node_modules")
+ set(OH_MODULES "${CMAKE_CURRENT_SOURCE_DIR}/../../../oh_modules")
set(RNOH_CPP_DIR "${CMAKE_CURRENT_SOURCE_DIR}/../../../../../../react-native-harmony/harmony/cpp")
set(LOG_VERBOSITY_LEVEL 1)
set(CMAKE_ASM_FLAGS "-Wno-error=unused-command-line-argument -Qunused-arguments")
set(CMAKE_CXX_FLAGS "-fstack-protector-strong -Wl,-z,relro,-z,now,-z,noexecstack -s -fPIE -pie")
set(WITH_HITRACE_SYSTRACE 1) # for other CMakeLists.txt files to use
add_compile_definitions(WITH_HITRACE_SYSTRACE)

add_subdirectory("${RNOH_CPP_DIR}" ./rn)

# RNOH_BEGIN: manual_package_linking_1
+ add_subdirectory("${OH_MODULES}/@react-native-ohos/react-native-lewin-screen-capture/src/main/cpp" ./lewin_screen_capture)
# RNOH_END: manual_package_linking_1

file(GLOB GENERATED_CPP_FILES "./generated/*.cpp")

add_library(rnoh_app SHARED
    ${GENERATED_CPP_FILES}
    "./PackageProvider.cpp"
    "${RNOH_CPP_DIR}/RNOHAppNapiBridge.cpp"
)
target_link_libraries(rnoh_app PUBLIC rnoh)

# RNOH_BEGIN: manual_package_linking_2
+ target_link_libraries(rnoh_app PUBLIC rnoh_lewin_screen_capture)
# RNOH_END: manual_package_linking_2
```

Open `entry/src/main/cpp/PackageProvider.cpp` and add:

```diff
#include "RNOH/PackageProvider.h"
+ #include "LewinScreenCapturePackage.h"

using namespace rnoh;

std::vector<std::shared_ptr<Package>> PackageProvider::getPackages(Package::Context ctx) {
    return {
+     std::make_shared<LewinScreenCapturePackage>(ctx)
    };
}
```

### 4. Import LewinScreenCapturePackage on the ArkTS side

Open `entry/src/main/ets/RNPackagesFactory.ets` and add:

```diff
  ...
+ import LewinScreenCapturePackage from '@react-native-ohos/react-native-lewin-screen-capture';

export function createRNPackages(ctx: RNPackageContext): RNPackage[] {
  return [
+    new LewinScreenCapturePackage(ctx)
  ];
}
```
</details>

### Run

Click the `sync` button in the upper right corner

Or run in the command line terminal:

```bash
cd entry
ohpm install
```

Then build and run the project.

## Constraints and Limitations

### Compatibility

This document has been verified with the following versions:

1.RNOH: 0.84.2; SDK: HarmonyOS 6.0.1 Release SDK; IDE: DevEco Studio 6.0.1.260; ROM:6.0.0.130;
2.RNOH: 0.82.22; SDK: HarmonyOS 6.0.0 Release SDK; IDE: DevEco Studio 6.0.0.878; ROM: 6.0.0.130;
3.RNOH: 0.77.18; SDK: HarmonyOS 6.0.0 Release SDK; IDE: DevEco Studio 6.0.0.858; ROM: 6.0.0.112;
4.RNOH: 0.72.33; SDK: HarmonyOS NEXT B1; IDE: DevEco Studio: 5.0.3.900; ROM: Next.0.0.71;

## Usage Example

The following code demonstrates the basic usage of this library:

> [!WARNING] The library name used in the `import` statement remains unchanged.

```javascript
import ScreenCaptureUtil from "react-native-lewin-screen-capture";

// 1. Listen for system screenshot events (callback triggered when a screenshot is taken)
const emitter = ScreenCaptureUtil.startListener((data) => {
  // data: { code: '200', uri: 'file://<sandbox path>', base64: '<image encoding>' }
  console.log("screenshot event", data.code, data.uri);
}, "");

// 2. Actively capture the current screen (result returned via callBack)
ScreenCaptureUtil.screenCapture(
  (data) => {
    if (data.code === "200") {
      console.log("captured:", data.uri, data.base64.length);
    }
  },
  true,
  { extension: "png", quality: 100, scale: 0 }
);

// 3. Stop listening (returns Promise<string>, resolves 'true' on success)
ScreenCaptureUtil.stopListener().then((res) => {
  console.log("stopListener:", res);
});

// 4. Clear the screenshot cache files
ScreenCaptureUtil.clearCache((data) => {
  console.log("clearCache:", data.code); // '200'
});
```

## API Reference

> [!TIP] The "Platform" column indicates the platforms supported by the property on the original third-party library.

> [!TIP] The "OpenHarmony Support" column: yes means the property is supported on the OpenHarmony platform; no means not supported; partially means partially supported. Usage is consistent across platforms, and the behavior is aligned with iOS or Android.

### API
| Name     | Type     | Param Type | Return Value | Required    | Platform | OpenHarmony Support | Description  |
|--------|---------|-----|-------|-------|--------|-----|-----------------|
| startListener   | function | callBack: (data: [CALL_BACK_PROPS](#data-structures)) => void, keyWords: string | Emitter | No | All | partially | Starts listening for system screenshot events; the screenshot info is returned via callBack when a screenshot is taken. `keyWords` is a reserved parameter for API compatibility and its value is not used in the logic on OpenHarmony; the callback image is a snapshot of the app window at the moment the event fires |
| stopListener  | function | /  | Promise\<string\>   | No | All | Yes   | Stops listening for screenshot events and removes the listener; resolves 'true' on success |
| screenCapture   | function | callBack: (data: [CALL_BACK_PROPS](#data-structures)) => void, isHiddenStatus: boolean, options: [CaptureOptions](#captureoptions) | / (result returned via callBack) | No | All | Yes   | Captures the current screen (app window snapshot). `isHiddenStatus` is a reserved parameter for compatibility and has no actual effect on OpenHarmony |
| clearCache | function | callBack: (data: [CALL_BACK_PROPS](#data-structures)) => void | / (result returned via callBack) | No | All | Yes   | Recursively deletes the screenshot cache directory; the result is returned via callBack |

### Data Structures

CALL_BACK_PROPS

| Name                           | Type          | Default       | Required            | Platform   | HarmonyOS Support    | Description |
|------------------------------|--------------------|------------|---------------|------|------------------|---------------|
| code                       | string             | /          | Yes            | All  | Yes              | `'200'` indicates success; other values indicate an exception |
| uri                     | string             | /          | No            | All  | Yes              | Screenshot file path (`file://<absolute app sandbox path>`)|
| base64                        | string             | /          | No            | All  | Yes              | Base64 encoding of the screenshot image |

CaptureOptions

| Name                           | Type          | Default       | Required            | Platform   | HarmonyOS Support    | Description |
|------------------------------|--------------------|------------|---------------|------|------------------|---------------|
| extension                       | string             | 'png'          | No            | All  | Yes              | Screenshot format; supports png / jpg / jpeg |
| quality                     | number             | 100          | No            | All  | Yes              | Compression quality; only effective for jpg/jpeg (PNG is lossless) |
| scale                          | number             | 0          | No            | All  | Yes              | Scales the screenshot proportionally when greater than 0; 0 means no scaling |

## Known Issues

None

## Others

None

## Directory Structure
````
/react-native-lewin-screen-capture  # project root directory
├── harmony              # HarmonyOS adaptation code
│    └─ lewin_screen_capture.har          # har package
│    └─ lewin_screen_capture                  # core HarmonyOS adaptation code
│          └─ index.ets    # adaptation code entry
│          └─ src/main/ets
│              └─ LewinScreenCaptureTurboModulesFactory.ets  # TurboModule implementation and Package export
│          └─ src/main/cpp
│              └─ LewinScreenCapturePackage.h  # C++ side Package registration
├── src                  # RN code
│    └─ index.js  # entry file (ScreenCaptureUtil)
│    └─ specs/v1/NativeScreenCapture.ts  # TurboModule type definitions
├── example              # example project (RNOH Tester)
├── README.md           # installation and usage guide (Chinese)
└── README_en.md        # installation and usage guide (English)
````

## Contributing

If you encounter any problems while using this library, feel free to submit an [Issue](https://github.com/react-native-oh-library/react-native-lewin-screen-capture/issues). Of course, [PR](https://github.com/react-native-oh-library/react-native-lewin-screen-capture/pulls)s are also highly welcome.

## License

This project is based on the [MIT License](https://github.com/react-native-oh-library/react-native-lewin-screen-capture/blob/master/LICENSE). Feel free to enjoy and contribute to open source.
