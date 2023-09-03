# custard-library

리액트 컴포넌트 라이브러리 포트폴리오를 위한 모노레포입니다.

## 모노레포 설정

`pnpm workspace`를 사용해 환경을 구성했습니다. 모노레포 구조, 설정하는 과정에서 알게 된 사실들을 정리하겠습니다.

### `packages`

- `eslint-config-custom`: 커스텀 ESLint 룰을 모아둡니다. `base.js`, `react.js` 등으로 분리해 관리합니다. 사용하는 측에서는 devDependency로 추가하고 ESLint config에서 extend하면 됩니다. ([예시](./packages/react-gantt/.eslintrc.json)) 패키지마다 조금씩 다른 설정을 할 수 있도록 이렇게 관리하기로 했습니다.
- `react-gantt`: 간트 차트 라이브러리입니다. `stylelint` 관련 설정이 추가됩니다.

### `apps`

- `web`: 라이브 데모를 위한 Next.js 앱입니다.
- `storybook`: 개발 용이성을 위해 Storybook 앱을 따로 만들었습니다. `packages`의 패키지를 직접 import하지 않고, `concurrently`를 사용해 Storybook 앱 실행과 build를 동시에 진행토록 해 빌드한 결과물을 사용합니다. 번들러로는 `vite`를 선택했습니다.

### `rollup.config.mjs`

- 사용한 플러그인
  - `@rollup/plugin-node-resolve`: external module resolver입니다.
  - `@rollup/plugin-terser`: minify를 위한 terser입니다.
  - `@rollup/plugin-typescript`: TS 트랜스파일을 위한 플러그인입니다. babel을 사용하지 않고 이 플러그인을 썼습니다.
  - `rollup-plugin-dts`: TS declare file 생성을 위한 플러그인입니다. 코드 빌드 후 따로 빌드합니다.
  - `@rollup/plugin-babel`: JSX 트랜스파일을 위해 사용한 babel 플러그인입니다. `@babel/preset-react`를 사용하며, `@babel/plugin-transform-runtime`으로 필요한 polyfill만 사용토록 했습니다. ([레퍼런스](https://poiemaweb.com/babel-polyfill))
  - `rollup-plugin-styles`: css, scss module 사용을 위해 추가한 플러그인입니다. 커스텀 style inject 함수를 정의해 사용했습니다. ([customStyleInjector](./css-injector.js))

### TypeScript

`tsconfig`를 구조화해 패키지마다 필요한 설정만을 가져갈 수 있도록 하고자 했습니다.

- `tsconfig.base.json`: 기본적으로 사용하는 config입니다.
- `tsconfig.cssModule.json`: css module을 위한 ts plugin을 추가하는 config입니다. 빌드시에는 `style.d.ts`에서 정의된 declare를 사용하지만, 개발 환경에서는 이 플러그인 덕분에 css module로 정의된 스타일에 대해 타입 체킹과 auto complete가 제공됩니다.
- `tsconfig.eslint.json`: ESLint용 config입니다.
- `tsconfig.paths.json`: 프로젝트별 alias, pacakges의 alias를 추가하는 config입니다.

각 패키지, 앱은 위의 config를 extend해 설정됩니다.

> 참고: `tsc --showConfig`로 컴파일러가 보는 최종 tsconfig를 확인할 수 있습니다.

#### Troubleshooting: Storybook tsconfig array extends issue

[apps/storybook의 tsconfig](./apps/storybook/tsconfig.json)에서는 `extends`에 `tsconfig.base.json`만 넣고, `paths` 프로퍼티를 하드코딩 했습니다. (`tsconfig.paths.json`도 같이 extends하지 못하고) `extends`에 배열을 넣을 수 없었기 때문입니다.

array extends는 추가된지 얼마 되지 않은 기능입니다. Storybook이 사용하는 esbuild 관련 라이브러리인 [`esbuild-register`](https://github.com/egoist/esbuild-register)에서 tsconfig resolver로 [`tsconfig-paths`](https://github.com/dividab/tsconfig-paths)를 사용하는데, `tsconfig-paths`쪽은 업데이트 됐는데 `esbuild-register`쪽에서 `tsconfig-paths`의 버전을 업그레이드하지 않고 있습니다.

때문에 `esbuild-register`를 의존하고 있는 Storybook에서는 이 문제를 해결할 방법이 마땅치 않은 상황입니다.

`package.json`에서 `resolutions` 프로퍼티로 `tsconfig-paths`의 버전을 강제로 올려보려고도 했지만, `esbuild-register`가 `tsconfig-paths`를 peerDependency가 아닌 devDependency로 가지고 있고, 빌드 결과물을 export하고 있어 `esbuild-register` 빌드를 다시 하지 않는 이상 이 방법은 사용할 수 없었습니다.

[관련 esbuild-register PR](https://github.com/egoist/esbuild-register/pull/91)

[관련 Storybook issue](https://github.com/storybookjs/storybook/issues/21792) (esbuild-register 말고 다른거 쓰면 안되냐고 징징거리는 제 코멘트를 볼 수 있습니다...)

`esbuild-register`는 마지막 publish가 22년 12월인 것으로 보아 근시일 내에 이 상황이 바뀌지는 않을 것 같습니다.

if문 하나 있고 없고 차이만 고치면 되는걸 패키지끼리 의존성으로 인해 해결하지 못하는겁니다. 이 경험으로 dependency를 추가할 때는 신중해야겠다는 생각을 하게 됐습니다.

> 똑같은 문제가 `eslint-plugin-import`에서도 발생했는데 이쪽은 dependency로 가지고 있어서 `resolutions` 프로퍼티 수정으로 해결이 가능했습니다.
