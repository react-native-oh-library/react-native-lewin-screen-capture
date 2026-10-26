> 文档模板：v0.4.2

<p align="center">
  <h1 align="center"> <code>react-native-lewin-screen-capture</code> </h1>
</p>

本项目基于 [react-native-lewin-screen-capture](https://github.com/LewinJun/react-native-lewin-screen-capture) 开发。

版本所属关系如下：

| 三方库名称    | 三方库版本（npm地址）    | 发布信息     | 支持RN版本    | Autolink     | 编译API版本     | 社区基线版本    |  源码地址   |
| ------------ | ------------ | ------------------------------ | ------------- | ------------- |------------------------ | ------------- | ------------- |
| @react-native-ohos/react-native-lewin-screen-capture | [1.1.0（开发中）](https://www.npmjs.com/package/@react-native-ohos/react-native-lewin-screen-capture)    | [Github Releases](https://github.com/wangfandev/react-native-lewin-screen-capture-jest/releases) | 0.72.\*/0.77.\*/0.82.\*/0.84.\* | 是 | API12+ | 1.1.0 | [master](https://github.com/wangfandev/react-native-lewin-screen-capture-jest) |

## 简介

react-native-lewin-screen-capture 组件用于 React Native。<br/>
提供系统截屏事件监听（`startListener`）与主动截取当前屏幕（`screenCapture`）两项核心能力，截图结果以 `{code, uri, base64}` 结构回调，并支持清理截屏缓存（`clearCache`）。<br/>
可应用于截屏分享、页面快照生成、敏感内容截屏检测等场景。

## 下载安装

进入到工程目录并输入以下命令：

**npm**

```bash
npm install @react-native-ohos/react-native-lewin-screen-capture
```

**yarn**

```bash
yarn add @react-native-ohos/react-native-lewin-screen-capture
```

## Link

|                                      | 是否支持autolink | RN框架版本 |
|--------------------------------------|----------------|-----------|
| 1.1.0                                | 是             |  0.72/0.77/0.82/0.84   |

使用AutoLink的工程需要根据该文档配置，Autolink框架指导文档：https://gitcode.com/CPF-RN/ohos_react_native/blob/master/docs/zh-cn/Autolinking.md

如您使用的版本支持 Autolink，并且工程已接入 Autolink，可跳过ManualLink配置。
<details>
  <summary>ManualLink: 此步骤为手动配置原生依赖项的指导</summary>

首先需要使用 DevEco Studio 打开项目里的 HarmonyOS 工程 `harmony`。

### 1. Overrides RN SDK

为了让工程依赖同一个版本的 RN SDK，需要在工程根目录的 `oh-package.json5` 添加 overrides 字段，指向工程需要使用的 RN SDK 版本。替换的版本既可以是一个具体的版本号，也可以是一个模糊版本，还可以是本地存在的 HAR 包或源码目录。

关于该字段的作用请阅读[官方说明](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/ide-oh-package-json5-V5#zh-cn_topic_0000001792256137_overrides)

```json
{
  "overrides": {
    "@rnoh/react-native-openharmony": "file:../node_modules/@react-native-oh/react-native-harmony/react_native_openharmony.har" // ohpm 在线版本
    // "@rnoh/react-native-openharmony" : "./react_native_openharmony.har" // 指向本地 har 包的路径
    // "@rnoh/react-native-openharmony" : "./react_native_openharmony" // 指向源码路径
  }
}
```

### 2. 引入原生端代码

目前有两种方法：

- 通过 har 包引入；
- 直接链接源码。

方法一：通过 har 包引入（推荐）

> [!TIP] har 包位于三方库安装路径的 `harmony` 文件夹下。

打开 `entry/oh-package.json5`，添加以下依赖

```json
"dependencies": {
    "@react-native-ohos/react-native-lewin-screen-capture": "file:../../node_modules/@react-native-ohos/react-native-lewin-screen-capture/harmony/lewin_screen_capture.har"
  }
```

点击右上角的 `sync` 按钮

或者在命令行终端执行：

```bash
cd entry
ohpm install
```

方法二：直接链接源码

> [!TIP] 如需使用直接链接源码，请参考[直接链接源码说明](https://gitcode.com/CPF-RN/usage-docs/blob/master/zh-cn/link-source-code.md)

### 3. 配置 CMakeLists 和引入 LewinScreenCapturePackage

打开 `entry/src/main/cpp/CMakeLists.txt`，添加：

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

打开 `entry/src/main/cpp/PackageProvider.cpp`，添加：

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

### 4. 在 ArkTs 侧引入 LewinScreenCapturePackage

打开 `entry/src/main/ets/RNPackagesFactory.ets`，添加：

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

### 运行

点击右上角的 `sync` 按钮

或者在命令行终端执行：

```bash
cd entry
ohpm install
```

然后编译、运行即可。

## 约束与限制

### 兼容性

本文档内容基于以下版本验证通过：

1.RNOH: 0.84.2; SDK: HarmonyOS 6.0.1 Release SDK; IDE: DevEco Studio 6.0.1.260; ROM:6.0.0.130;
2.RNOH: 0.82.22; SDK: HarmonyOS 6.0.0 Release SDK; IDE: DevEco Studio 6.0.0.878; ROM: 6.0.0.130;
3.RNOH: 0.77.18; SDK: HarmonyOS 6.0.0 Release SDK; IDE: DevEco Studio 6.0.0.858; ROM: 6.0.0.112;
4.RNOH: 0.72.33; SDK: HarmonyOS NEXT B1; IDE: DevEco Studio: 5.0.3.900; ROM: Next.0.0.71;

## 使用示例

下面的代码展示了这个库的基本使用场景：

> [!WARNING] 使用时 import 的库名不变。

```javascript
import ScreenCaptureUtil from "react-native-lewin-screen-capture";

// 1. 监听系统截屏事件（截屏触发时回调）
const emitter = ScreenCaptureUtil.startListener((data) => {
  // data: { code: '200', uri: 'file://<沙箱路径>', base64: '<图片编码>' }
  console.log("screenshot event", data.code, data.uri);
}, "");

// 2. 主动截取当前屏幕（结果经 callBack 返回）
ScreenCaptureUtil.screenCapture(
  (data) => {
    if (data.code === "200") {
      console.log("captured:", data.uri, data.base64.length);
    }
  },
  true,
  { extension: "png", quality: 100, scale: 0 }
);

// 3. 停止监听（返回 Promise<string>，成功 resolve 'true'）
ScreenCaptureUtil.stopListener().then((res) => {
  console.log("stopListener:", res);
});

// 4. 清除截屏缓存文件
ScreenCaptureUtil.clearCache((data) => {
  console.log("clearCache:", data.code); // '200'
});
```

## 接口说明

> [!TIP] "Platform"列表示该属性在原三方库上支持的平台。

> [!TIP] "OpenHarmony Support"列为 yes 表示 OpenHarmony平台支持 该属性；no 则表示不支持；partially 表示部分支持。使用方法跨平台一致，效果对标 iOS 或 Android 的效果。

### API
| 名称     | 类型     | 参数类型 | 返回值 | 必填    | 平台 | OpenHarmony平台支持 | 描述  |
|--------|---------|-----|-------|-------|--------|-----|-----------------|
| startListener   | function | callBack: (data: [CALL_BACK_PROPS](#数据结构)) => void, keyWords: string | Emitter | No | All | partially | 开始监听系统截屏事件，截屏触发时经 callBack 回调截图信息。`keyWords` 为 API 兼容保留参数，鸿蒙端值不参与逻辑；回调图片为事件触发时刻的应用窗口快照 |
| stopListener  | function | /  | Promise\<string\>   | No | All | Yes   | 停止截屏事件监听并移除监听器，成功 resolve 'true' |
| screenCapture   | function | callBack: (data: [CALL_BACK_PROPS](#数据结构)) => void, isHiddenStatus: boolean, options: [CaptureOptions](#captureoptions) | / （结果经 callBack 回调） | No | All | Yes   | 截取当前屏幕（应用窗口快照）。`isHiddenStatus` 为兼容保留参数，鸿蒙端无实际影响 |
| clearCache | function | callBack: (data: [CALL_BACK_PROPS](#数据结构)) => void | / （结果经 callBack 回调） | No | All | Yes   | 递归删除截屏缓存目录，结果经 callBack 回调 |

### 数据结构

CALL_BACK_PROPS

| 名称                           | 参数类型          | 默认值       | 必填            | 平台   | HarmonyOS平台支持    | 描述 |
|------------------------------|--------------------|------------|---------------|------|------------------|---------------|
| code                       | string             | /          | Yes            | All  | Yes              | `'200'` 表示正常，其他为异常 |
| uri                     | string             | /          | No            | All  | Yes              | 截图文件路径（`file://<应用沙箱绝对路径>`）|
| base64                        | string             | /          | No            | All  | Yes              | 截图图片的 base64 编码 |

CaptureOptions

| 名称                           | 参数类型          | 默认值       | 必填            | 平台   | HarmonyOS平台支持    | 描述 |
|------------------------------|--------------------|------------|---------------|------|------------------|---------------|
| extension                       | string             | 'png'          | No            | All  | Yes              | 截图格式，支持 png / jpg / jpeg |
| quality                     | number             | 100          | No            | All  | Yes              | 压缩质量，仅对 jpg/jpeg 生效（PNG 无损） |
| scale                          | number             | 0          | No            | All  | Yes              | 大于 0 时等比缩放截图，0 表示不缩放 |

## 遗留问题

无

## 其他

无

## 目录结构
````
/react-native-lewin-screen-capture  # 项目根目录
├── harmony              # 鸿蒙适配代码
│    └─ lewin_screen_capture.har          # har包
│    └─ lewin_screen_capture                  # 鸿蒙适配核心代码
│          └─ index.ets    # 鸿蒙适配代码入口
│          └─ src/main/ets
│              └─ LewinScreenCaptureTurboModulesFactory.ets  # TurboModule 实现与 Package 导出
│          └─ src/main/cpp
│              └─ LewinScreenCapturePackage.h  # C++ 侧 Package 注册
├── src                  # RN代码
│    └─ index.js  # 入口文件（ScreenCaptureUtil）
│    └─ specs/v1/NativeScreenCapture.ts  # TurboModule 类型定义
├── example              # 示例工程（RNOH Tester）
├── README.md           # 中文安装使用方法
└── README_en.md        # 英文安装使用方法
````

## 贡献代码

使用过程中发现任何问题都可以提交 [Issue](https://github.com/react-native-oh-library/react-native-lewin-screen-capture/issues)，当然，也非常欢迎提交 [PR](https://github.com/react-native-oh-library/react-native-lewin-screen-capture/pulls) 。

## 开源协议

本项目基于 [MIT License](https://github.com/react-native-oh-library/react-native-lewin-screen-capture/blob/master/LICENSE) ，请自由地享受和参与开源。
