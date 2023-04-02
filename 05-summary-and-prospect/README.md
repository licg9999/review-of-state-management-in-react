# Review of state management in React: summary and prospect

In [the initial article](../01-getting-started-with-an-mvc-example/README.md), thinking that doing good state management is necessary to develop a good React app but there is no clear winner yet among today's widely-accepted libraries of state management in React, 2 questions were raised:

1. How good are today's widely-accepted libraries of state management in React?
1. What does a better library of state management in React look like?

Then, with [the example of the composite clock built with MVC pattern](https://github.com/licg9999/review-of-state-management-in-react/tree/master/01-getting-started-with-an-mvc-example) from the initial article as a baseline, in the previous articles, for each widely-accepted library of [reducer-like solutions](../02-reducer-like-solutions-redux-and-its-family/README.md), [facebook's experiment](../03-facebook-s-experiment-recoil/README.md), [lightweight trials](../04-kinds-of-lightweight-trials-mobx-zustand-jotai-and-valtio/README.md), I've rebuilt the same example module with it and reviewed how good it is in comparison with the baseline to answer the question #1.

And now, by this article, I would summarize all of those reviews for a more comprehensive overall understanding of today's widely-accepted libraries of state management in React, then find out useful insights and try to give a prospect of a better library to answer the question #2.

## Summary

Firstly, briefs of all the reviews are collected from the previous articles in relatively consistent descriptions as follows for an easy reference:

_MVC pattern:_

- _Pros:_ The app domain is clearly split.
- _Cons:_ On scaling up the app, the chain of state-changing events can hardly be fully tracked so states changing becomes unpredictable.

_Redux family:_

- _Pros:_ Available state-changing logics on each state are clearly defined in each reducer and they don't get any more state-changing logics invoked regardless of how they are invoked, so states changing is predictable despite the scale of the app.
- _Cons:_ (1) Getting one state managed requires multiple high-coupling parts. (2) It's not well supported to make module-wide states.

_Recoil:_

- _Pros:_ (1) State-changing logics may get more state-changing logics invoked but the very last step of states changing don't, so states changing is predictable at limited cost of tracking state-changing logics. (2) It's easy to make module-wide states.
- _Cons:_ Caring much about asynchronousness brings a burden of states accessing in state-changing logics.

_MobX:_

- _Pros:_ (1) State-changing logics may get more state-changing logics invoked but the very last step of states changing don't, so states changing is predictable at limited cost of tracking state-changing logics. (2) The app domain is clearly split.
- _Cons:_ A strong understanding of MobX's subscription mechanism is needed.

_Zustand:_

- _Pros:_ Available state-changing logics on each state are clearly defined in each store and they don't get any more state-changing logics invoked regardless of how they are invoked, so states changing is predictable despite the scale of the app.
- _Cons:_ It's not well supported to make (1) data deriving, (2) state-changing logics across stores, (3) initial states assigning dynamically on a view component initialization and (4) module-wide states.

_Jotai:_

- _Pros:_ (1) State-changing logics may get more state-changing logics invoked, but the very last step of states changing don't, so states changing is predictable at limited cost of tracking state-changing logics. (2) It's easy to make module-wide states.
- _Cons:_ Not much.

_Valtio:_

- _Pros:_ State-changing logics may get more state-changing logics invoked but the very last step of states changing don't, so states changing is predictable at limited cost of tracking state-changing logics.
- _Cons:_ It's not well supported to make module-wide states.

Additionally, some details that are not listed here may be referenced later but they can always be found in the sections entitled with 'Review of state management with ...' in the previous articles.

In terms of the pros of the widely-accepted libraries, predictable states changing is always archieved but with 2 different kinds of ideas.

1. _One is,_ like Redux, available state-changing logics on each state are clearly defined and they don't get any more state-changing logics invoked regardless of how they are invoked. On invoking a snippet of clearly defined state-changing logics on a state, I would know it only changes that one state without my tracking the detailed logics inside. So, states changing is predictable despite the scale of the app.
1. _The other is,_ like Recoil and MobX, state-changing logics can be arbitrarily defined but the very last step of states changing don't get any more state-changing logics invoked. On invoking a snippet of state-changing logics, I can't tell what states it changes but it's very easy to figure it out. So, states changing is predictable at limited cost of tracking state-changing logics.

Although the idea of #1 is better than that of #2 on scaling up the app, the overall cost of using a library of #1 may still be higher. The reason is, the need for a snippet of state-changing logics across multiple states always comes on scaling up the app, but to prepare it, defining the underlying snippets of state-changing logics per state is required. Very often, these underlying snippets of state-changing logics per state are defined only for that specific snippet of state-changing logics across multiple states and can't be reused somewhere else, which makes the 2 parts high-coupling. When some parts are high-coupling, building or maintaining one of them always involves building or maintaining the rest parts, which brings difficulties in development. So, #1 is better than #2 only theoretically but not practically.

In terms of the cons of the widely-accepted libraries, some are just the oppsite side of the pros, others are caused by the preferences:

1. _Cons by pros:_ Like Redux and Zustand, cons of high coupling between state-changing logics across multiple states and state-changing logics per state are not resolveable as long as these libraries continue holding their pros. Cons of this kind are binded with the pros.
1. _Cons by preferences:_ Like Recoil, its preference is taking care of asynchronousness and letting in the burden because of it. Although asynchrounous state management is helped, synchronous state management which is the major part of state management is harmed, and also asynchronous logics in state management can easily be implemented as multi-step synchronous logics, which makes it not quite worthy. Like MobX, its preference is providing its own subscription mechanism. Although certain performance issues are improved, natural coding in React is harmed, and also it's argueable that a deeper integration with React can't do the same, which makes it look not good enough. Like Zustand and Valtio, their preference is providing no support for data deriving, initial states assigning dynamically on a view component initialization and module-wide states. Although it can be made by user devs, it is so often needed, which makes it look not well-designed.

For cons of #1, resolving them requires rethinking of how the pros come into being, which is hard but not impossible. For cons of #2, resolving them requires thinking carefully of what is needed or not in state management, which is also doable. By the way, an interesting finding is, Jotai comes with the pro of #2 so avoids cons of #1, but also it doesn't commit any cons of #2, which makes it stand out. However, the pro of #2 is not as strong as the pro of #1 because safely invoking state-changing logics requires tracking state-changing logics a bit, even though the cost is limited.

## Prospect

Next, let me turn to the question #2, _What does a better library of state management in React look like?_. Today, there are libraries that achieve predictable states changing despite the scale of the app but at high overall cost of development, as well as libraries that achieve predictable states changing at limited cost of tracking state-changing logics but end up with low overall cost. So, what if here comes a library that achieves predictable states changing despite the scale of the app like the former ones but at cost of development no higher than the latter ones? Then, I would have the question answered.

Libraries of the former achieve predictable states changing despite the scale of the app because available state-changing logics on each state are clearly defined and they don't get any more state-changing logics invoked regardless of how they are invoked. Though, on the other hand, their high coupling between state-changing logics across multiple states and state-changing logics per state takes high cost of development. So, what if here comes a library where available state-changing logics on **one or more** states can be clearly defined and they don't get any more state-changing logics invoked regardless of how they are invoked? Then, high coupling would be eliminated, so the cost would be decreased.

Thinking of being predictable, today's most predictable programming methodology can be functional programming. Thinking of states as data and states changing as data changing, [reduce function](../02-reducer-like-solutions-redux-and-its-family/README.md) can help. But, instead of using each reducer to define all available state-changing logics on one state like Redux, I would use each reducer to define only one kind of state-changing logics on one or more states. Because each reducer is a pure function without any side effect, there is no chance for state-changing logics in a reducer to get any state-changing logics on other states invoked regardless of they are invoked. Then, high coupling is eliminated and predictable states changing despite the scale of the app is still achieved. Also, as a reducer is only a pure function, it can be ordinarily called in other reducers knowing it brings no side effect. The reducers of this kind would be depicted as follows:

```ts
type Reducer<TStates, TPayloads extends []> = (
  oneOrMoreStates: TStates,
  ...payloads: TPayloads
) => TStates;
```

Further more, every rest part involved in state management is supposed to be designed for low cost, too. For representing a state, the simplest form would be a config that identifies the state and provides the default value along with the type. Then, a Plain Old JavaScript Object(POJO) is good enough. To distinguish state configs from the states they represent, I can put the prefix `$` to names of these POJOs of state configs. For representing a derived datum, the simplest form would be the calculation process itself. Then, a pure function of a getter on one or more states is good enough. And, a data deriving getter can be ordinarily called in reducers or other data deriving getters, too. They would be depicted as follows:

```ts
// The config of the 'stateA'
const $stateA: StateA = {
  ...
};

interface StateA {
  ...
}

// The calculation process of the 'derivedDatumX'
function getDerivedDatumX(...): ... {
  ...
};
```

I would call this better library of state management in React as 'MyLib' in this article. Then, the minimal interfaces provided by MyLib are can be listed as follows. The 'operate' invokes reducers for states changing. The 'snapshot' accesses states for rendering. The 'store' along with the store provider host states:

```ts
import type { PropsWithChildren } from 'react';

export interface MyBaseState {}

export interface MyOperate {
  <TFn extends AnyFn>(
    $oneOrMoreStates: Parameter0<TFn>,
    fn: TFn,
    ...payloads: ParametersExcept0<TFn>
  ): ReturnType<typeof fn>;
}

export function useMyOperate(): MyOperate;

export function useMySnapshot<TState extends MyBaseState>($state: TState): TState;
export function useMySnapshot<TState extends MyBaseState, TValue = TState>(
  $state: TState,
  select: (state: TState) => TValue
): TValue;

export interface MyStore {
  getState<TState extends MyBaseState>($state: TState): TState;

  setState<TState extends MyBaseState>(
    $state: TState,
    stateOrGetState: TState | ((oldState: TState) => TState)
  ): TState;
}

export interface MyStoreProviderProps extends PropsWithChildren {
  initialize?(store: MyStore): void;
}

export function MyStoreProvider(props: MyStoreProviderProps): ReactElement;

export function useMyStore(): MyStore;

type AnyFn = (...args: any) => any;

type Parameter0<TFn extends AnyFn> = TFn extends (arg0: infer P, ...args: any) => any ? P : never;

type ParametersExcept0<TFn extends AnyFn> = TFn extends (arg0: any, ...args: infer P) => any
  ? P
  : never;
```

The preliminary implementation of MyLib is hosted at [review-of-state-management-in-react/05-summary-and-prospect/src/MyLib](https://github.com/licg9999/review-of-state-management-in-react/tree/master/05-summary-and-prospect/src/MyLib). Now, let me rebuild the baseline example module with MyLib to see how good it is in comparison. For the requirement of the example module, it can be found in any starting sections of any previous articles and please read it if needed.

Again, `create-react-app` is used to initialize the React app. The option `--template typescript` is used to enable TypeScript:

```sh
$ npx create-react-app 05-summary-and-prospect --template typescript
# ...
$ cd 05-summary-and-prospect
```

The version of CRA in use is `5.0.1` and the generated directory structure looks as follows:

```sh
$ tree -I node_modules
.
├── README.md
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src
│   ├── App.css
│   ├── App.test.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── index.tsx
│   ├── logo.svg
│   ├── react-app-env.d.ts
│   ├── reportWebVitals.ts
│   └── setupTests.ts
└── tsconfig.json

2 directories, 19 files
```

Then, `src/App.tsx` is cleared for later use, unused files are removed, the package of time helpers is installed:

```tsx
// src/App.tsx
import { FC } from 'react';

const App: FC = () => {
  return null;
};

export default App;
```

```sh
$ rm src/App.css src/App.test.tsx src/logo.svg
```

```sh
$ npm i date-fns
```

Then, to use MyLib, just copy [it](https://github.com/licg9999/review-of-state-management-in-react/tree/master/05-summary-and-prospect/src/MyLib) into `src/MyLib`. Also, to get `for...of` statements in MyLib to work, `tsconfig.json` needs to be adjusted a bit:

```diff
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
-    "jsx": "react-jsx"
+    "jsx": "react-jsx",
+    "downlevelIteration": true
  },
  "include": ["src"]
}
```

The example module, the composite clock, would be all placed in `src/CompositeClock`. To match the 3 requried states, there would be 3 groups of state configs, data deriving getters and state-changing reducers.

And for view components, there are `AnalogueView.ts` for the analogue clock, `DigitalView.ts` for the digital clock, and `CompositeView.ts` as a glue. Besides, store providers are initialized.

![Relation of parts in the composite clock built with MyLib](../assets/706378bced13ade2f6fbc9bd20e4a97f42a08443.jpg)

The 3 groups of state configs, data deriving getters and state-changing reducers are coded as follows:

```ts
// src/CompositeClock/TimeState.ts
export interface TimeState {
  timestamp: number;
}

export const $timeState: TimeState = {
  timestamp: 0,
};

export function changeTimestamp(timeState: TimeState, timestamp: number): TimeState {
  return { ...timeState, timestamp };
}
```

```ts
// src/CompositeClock/AnalogueState.ts
import { changeTimestamp, TimeState } from './TimeState';

const TWO_PI = 2 * Math.PI;

export interface AnalogueAngles {
  hour: number;
  minute: number;
  second: number;
}

export interface AnalogueState {
  isEditMode: boolean;
  editModeAngles: AnalogueAngles;
}

export const $analogueState: AnalogueState = {
  isEditMode: false,
  editModeAngles: { hour: 0, minute: 0, second: 0 },
};

export function getDisplayAngles(timeState: TimeState): AnalogueAngles {
  const d = new Date(timeState.timestamp);
  return {
    hour: ((d.getHours() % 12) / 12) * TWO_PI + (d.getMinutes() / 60) * (TWO_PI / 12),
    minute: (d.getMinutes() / 60) * TWO_PI + (d.getSeconds() / 60) * (TWO_PI / 60),
    second: (d.getSeconds() / 60) * TWO_PI,
  };
}

export function enterEditMode([state, timeState]: [AnalogueState, TimeState]): [
  AnalogueState,
  TimeState
] {
  if (state.isEditMode) return [state, timeState];
  return [{ ...state, isEditMode: true, editModeAngles: getDisplayAngles(timeState) }, timeState];
}

export function exitEditMode(
  [state, timeState]: [AnalogueState, TimeState],
  submit: boolean = true
): [AnalogueState, TimeState] {
  if (!state.isEditMode) return [state, timeState];
  if (submit) {
    const d = new Date(timeState.timestamp);
    d.setHours(
      Math.floor((state.editModeAngles.hour / TWO_PI) * 12) + 12 * Math.floor(d.getHours() / 12)
    );
    d.setMinutes((state.editModeAngles.minute / TWO_PI) * 60);
    d.setSeconds((state.editModeAngles.second / TWO_PI) * 60);
    timeState = changeTimestamp(timeState, d.getTime());
  }
  return [{ ...state, isEditMode: false }, timeState];
}

export function changeEditModeMinuteAngle(
  state: AnalogueState,
  minuteAngle: number
): AnalogueState {
  return {
    ...state,
    editModeAngles: {
      ...state.editModeAngles,
      minute: (minuteAngle + TWO_PI) % TWO_PI,
      hour:
        (Math.floor((state.editModeAngles.hour / TWO_PI) * 12) + minuteAngle / TWO_PI) *
        (TWO_PI / 12),
    },
  };
}
```

```ts
// src/CompositeClock/DigitalState.ts
import { format, isMatch, parse } from 'date-fns';
import { changeTimestamp, TimeState } from './TimeState';

export const DIGITAL_TEXT_FORMAT = 'HH:mm:ss';

export interface DigitalState {
  isEditMode: boolean;
  editModeText: string;
}

export const $digitalState: DigitalState = {
  isEditMode: false,
  editModeText: '',
};

export function getDisplayText(timeState: TimeState): string {
  return format(timeState.timestamp, DIGITAL_TEXT_FORMAT);
}

export function isEditModeTextValid(state: DigitalState): boolean {
  return isMatch(state.editModeText, DIGITAL_TEXT_FORMAT);
}

export function enterEditMode([state, timeState]: [DigitalState, TimeState]): [
  DigitalState,
  TimeState
] {
  if (state.isEditMode) return [state, timeState];
  return [{ ...state, isEditMode: true, editModeText: getDisplayText(timeState) }, timeState];
}

export function exitEditMode(
  [state, timeState]: [DigitalState, TimeState],
  submit: boolean = true
): [DigitalState, TimeState] {
  if (!state.isEditMode) return [state, timeState];
  if (submit && isEditModeTextValid(state)) {
    timeState = changeTimestamp(
      timeState,
      parse(state.editModeText, DIGITAL_TEXT_FORMAT, timeState.timestamp).getTime()
    );
  }
  return [{ ...state, isEditMode: false }, timeState];
}

export function changeEditModeText(state: DigitalState, editModeText: string): DigitalState {
  return { ...state, editModeText };
}
```

And, view components are coded as follows:

```tsx
// src/CompositeClock/AnalogueView.tsx
import { FC, useCallback, useEffect } from 'react';
import { useMyOperate, useMySnapshot } from '../MyLib';
import {
  $analogueState,
  changeEditModeMinuteAngle,
  enterEditMode,
  exitEditMode,
  getDisplayAngles,
} from './AnalogueState';
import styles from './AnalogueView.module.css';
import { $timeState } from './TimeState';

const TWO_PI = 2 * Math.PI;

interface Props {
  className?: string;
}

export const AnalogueView: FC<Props> = ({ className }) => {
  const operate = useMyOperate();
  const { isEditMode, editModeAngles } = useMySnapshot($analogueState);
  const displayAngles = useMySnapshot($timeState, getDisplayAngles);

  const angles = isEditMode ? editModeAngles : displayAngles;

  const calcEditModeMinuteAngle = useCallback(
    (pointX: number, pointY: number): number => {
      const pointLen = Math.sqrt(Math.pow(pointX, 2) + Math.pow(pointY, 2));

      const normalizedX = pointX / pointLen;
      const normalizedY = pointY / pointLen;

      const oldX = Math.sin(editModeAngles.minute);
      const oldY = Math.cos(editModeAngles.minute);

      const rawMinuteAngle = Math.acos(normalizedY);

      const minuteAngle =
        normalizedY > 0 && oldY > 0
          ? normalizedX >= 0
            ? oldX < 0
              ? rawMinuteAngle + TWO_PI
              : rawMinuteAngle
            : oldX >= 0
            ? -rawMinuteAngle
            : -rawMinuteAngle + TWO_PI
          : normalizedX >= 0
          ? rawMinuteAngle
          : -rawMinuteAngle + TWO_PI;

      return minuteAngle;
    },
    [editModeAngles]
  );

  const onMinuteHandMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      operate([$analogueState, $timeState], enterEditMode);
    },
    [operate]
  );

  const onMouseLeave = useCallback(() => {
    operate([$analogueState, $timeState], exitEditMode);
  }, [operate]);

  const onMouseUp = useCallback(() => {
    operate([$analogueState, $timeState], exitEditMode);
  }, [operate]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (isEditMode && e.key === 'Escape') {
        operate([$analogueState, $timeState], exitEditMode, false);
      }
    },
    [operate, isEditMode]
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>): void => {
      if (!isEditMode) return;

      const boundingBox = e.currentTarget.getBoundingClientRect();
      const originX = boundingBox.x + boundingBox.width / 2;
      const originY = boundingBox.y + boundingBox.height / 2;

      const pointX = e.clientX - originX;
      const pointY = originY - e.clientY;

      operate($analogueState, changeEditModeMinuteAngle, calcEditModeMinuteAngle(pointX, pointY));
    },
    [operate, calcEditModeMinuteAngle, isEditMode]
  );

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  return (
    <div
      className={`${className ?? ''} ${styles.root} ${isEditMode ? styles.editMode : ''}`}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      <div className={styles.axis} />
      <div
        className={`${styles.hand} ${styles.hour}`}
        style={{ transform: `rotateZ(${angles.hour}rad)` }}
      />
      <div
        className={`${styles.hand} ${styles.minute}`}
        style={{ transform: `rotateZ(${angles.minute}rad)` }}
        onMouseDown={onMinuteHandMouseDown}
      />
      <div
        className={`${styles.hand} ${styles.second}`}
        style={{ transform: `rotateZ(${angles.second}rad)` }}
      />
    </div>
  );
};
```

```css
/* src/CompositeClock/AnalogueView.module.css */
.root {
  margin: 12px;
  padding: 8px;
  width: 160px;
  height: 160px;
  border-radius: 100%;
  border: 1px solid black;
  position: relative;
}

.axis {
  position: absolute;
  background-color: black;
  left: 47.5%;
  top: 47.5%;
  width: 5%;
  height: 5%;
  border-radius: 100%;
}

.hand {
  position: absolute;
  background-color: black;
  transform-origin: bottom center;
}

.hand.hour {
  left: 48.5%;
  top: 25%;
  height: 25%;
  width: 3%;
}

.hand.minute {
  left: 49%;
  top: 10%;
  height: 40%;
  width: 2%;
  z-index: 10;
  cursor: pointer;
}

.hand.second {
  left: 49.5%;
  top: 10%;
  height: 40%;
  width: 1%;
}

.editMode.root {
  outline: 2px solid skyblue;
}
```

```tsx
// src/CompositeClock/DigitalView.tsx
import { FC, useCallback, useEffect, useRef } from 'react';
import { useMyOperate, useMySnapshot } from '../MyLib';
import {
  $digitalState,
  changeEditModeText,
  DIGITAL_TEXT_FORMAT,
  enterEditMode,
  exitEditMode,
  getDisplayText,
  isEditModeTextValid,
} from './DigitalState';
import styles from './DigitalView.module.css';
import { $timeState } from './TimeState';

interface Props {
  className?: string;
}

export const DigitalView: FC<Props> = ({ className }) => {
  const operate = useMyOperate();
  const state = useMySnapshot($digitalState);
  const { isEditMode, editModeText } = state;
  const displayText = useMySnapshot($timeState, getDisplayText);

  const refEditor = useRef<HTMLInputElement | null>(null);

  const onDisplayClick = useCallback(() => {
    operate([$digitalState, $timeState], enterEditMode);
  }, [operate]);

  const onEditorBlur = useCallback(() => {
    operate([$digitalState, $timeState], exitEditMode, false);
  }, [operate]);

  const onEditorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      operate($digitalState, changeEditModeText, e.target.value);
    },
    [operate]
  );

  const onEditorKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        operate([$digitalState, $timeState], exitEditMode);
      }
    },
    [operate]
  );

  useEffect(() => {
    if (isEditMode && refEditor.current) {
      refEditor.current.select();
    }
  }, [isEditMode]);

  return (
    <div className={`${className ?? ''} ${styles.root} ${isEditMode ? styles.editMode : ''}`}>
      {isEditMode ? (
        <>
          <input
            className={styles.editor}
            type="text"
            ref={refEditor}
            value={editModeText}
            onBlur={onEditorBlur}
            onChange={onEditorChange}
            onKeyDown={onEditorKeyDown}
          />
          {!isEditModeTextValid(state) && (
            <div className={styles.invalidHint}>
              The input time doesn't match the expected format which is '{DIGITAL_TEXT_FORMAT}'.
            </div>
          )}
        </>
      ) : (
        <div onClick={onDisplayClick}>{displayText}</div>
      )}
    </div>
  );
};
```

```css
/* src/CompositeClock/DigitalView.module.css */
.root {
  border: 1px solid black;
  width: 200px;
  line-height: 30px;
  text-align: center;
}

.editor {
  width: 100%;
  text-align: center;
  font-size: inherit;
  padding: 0;
  border: none;
  outline: none;
}

.invalidHint {
  line-height: 1.2;
}

.editMode.root {
  outline: 2px solid skyblue;
}
```

```tsx
// src/CompositeClock/CompositeView.tsx
import { FC, useCallback, useEffect, useRef } from 'react';
import { useMyOperate, useMySnapshot, useMyStore } from '../MyLib';
import { $analogueState } from './AnalogueState';
import { AnalogueView } from './AnalogueView';
import styles from './CompositeView.module.css';
import { $digitalState } from './DigitalState';
import { DigitalView } from './DigitalView';
import { $timeState, changeTimestamp } from './TimeState';

export const CompositeView: FC = () => {
  const operate = useMyOperate();
  const store = useMyStore();
  const isEditModeInAnalogueClock = useMySnapshot(
    $analogueState,
    (analogueState) => analogueState.isEditMode
  );
  const isEditModeInDigitalClock = useMySnapshot(
    $digitalState,
    (digitalState) => digitalState.isEditMode
  );

  const calcTimestampCorrection = useCallback(
    () => store.getState($timeState).timestamp - Date.now(),
    [store]
  );

  const refTimeCorrection = useRef<number>(calcTimestampCorrection());

  useEffect(() => {
    if (!isEditModeInAnalogueClock || !isEditModeInDigitalClock) {
      refTimeCorrection.current = calcTimestampCorrection();
    }
  }, [calcTimestampCorrection, isEditModeInAnalogueClock, isEditModeInDigitalClock]);

  useEffect(() => {
    const tickHandler = setInterval(
      () => operate($timeState, changeTimestamp, Date.now() + refTimeCorrection.current),
      100
    );
    return () => clearInterval(tickHandler);
  }, [operate]);

  return (
    <div className={styles.root}>
      <AnalogueView />
      <DigitalView />
    </div>
  );
};
```

```css
/* src/CompositeClock/CompositeView.module.css */
.root {
  margin: 16px 8px;
  font-size: 16px;
}
```

After that, store providers are initialized per app for app-wide states and per module for module-wide states:

```tsx
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { MyStoreProvider } from './MyLib';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <MyStoreProvider>
      <App />
    </MyStoreProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

```diff
// src/CompositeClock/CompositeView.tsx
import { FC, useCallback, useEffect, useRef } from 'react';
-import { useMyOperate, useMySnapshot, useMyStore } from '../MyLib';
+import { MyStoreProvider, useMyOperate, useMySnapshot, useMyStore } from '../MyLib';

...

+export const CompositeClock: FC = () => {
+  return (
+    <MyStoreProvider
+      initialize={(store) => {
+        store.setState($timeState, { timestamp: Date.now() });
+      }}
+    >
+      <CompositeView />
+    </MyStoreProvider>
+  );
+};
```

Then, the composite clock is exported and used in `App.tsx`:

```ts
// src/CompositeClock/index.ts
export { CompositeClock } from './CompositeView';
```

```diff
import { FC } from 'react';
+import { CompositeClock } from './CompositeClock';

const App: FC = () => {
-  return null;
+  return <CompositeClock />;
};

export default App;
```

The example module built with MyLib is complete. It can be previewed with the command `npm start` and its codebase is hosted at [review-of-state-management-in-react/05-summary-and-prospect](https://github.com/licg9999/review-of-state-management-in-react/tree/master/05-summary-and-prospect).

In MyLib, available state-changing logics on one or more state are clearly defined in reducers and they don't get any state-changing logics on other states invoked regardless of how they are invoked, so I would know a reducer only changes wanted states without my tracking the detailed logics inside on invoking it, which makes states changing predictable despite the scale of the app. Meanwhile, no part is high-coupling but support for necessary usages is all provided, so cost of development is low. As a sum-up, doing state management with MyLib would be better than that with any today's widely-accepted libraries of state management in React.

## Postscript

By far, the series of articles entitled with 'Review of state management in React: ...' is finalized. All the today's widely-accepted libraries of state management have been reviewed and a prospect of a better library has been given. The whole codebase of articles and examples is hosted at [licg9999/review-of-state-management-in-react](https://github.com/licg9999/review-of-state-management-in-react). To develop a good React app, doing good state management is necessary. To do good state management, a good solution of state management is necessary. I believe these articles are not either the first ones or the last ones searching for better solutions. But, at lease, I only wish these articles can get us developers one step closer to one of them.
