import { SceneProps } from "./Scene"
import type { Viewport } from "./types"
import { type Accessor, createContext, createSignal, type ParentProps, useContext, JSX, onMount, createEffect, createMemo, on } from "solid-js"

declare global {
    var COMPOSITION: {
        fps: number
        viewport: {
            width: number
            height: number
        },
        scenes: number
        totalFrames: number
        totalDuration: number
    };
}

export type SceneInfo = {
    id: number
    start: number
    end: number
    duration: number
}

type CompositionContextType = {
    getElapsed: Accessor<number>
    getCurrentFrame: Accessor<number>
    registerScene: (scene: SceneProps) => SceneInfo;
    getCurrentScene: () => number;
    done: () => void;
}

const CompositionContext = createContext<CompositionContextType>();

const getFixedFrame = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const frame = urlParams.get('frame');
    if(frame){
        return parseInt(frame, 10);
    }

    return null;
}

type Props = ParentProps<{
    id?: string
    fps: number
    viewport: Viewport
}>

export default function Composition(props: Props){
    const scenes = [] as SceneProps[];
    let _total_duration = 0;
    const _fps = props.fps;
    const _frame_duration_ms = 1000.0 / props.fps;
    console.log(`Refrescando cada ${_frame_duration_ms}ms`);
    const fixedFrame = getFixedFrame();
    console.log("Fixed frame: ", fixedFrame)
    let _currentFrame = 0;
    //const [getCurrentFrame, setCurrentFrame] = createSignal(0);
    const [getDone, setDone] = createSignal<boolean>(false);
    const [getSceneCount, setSceneCount] = createSignal<number>(0);
    const [getElapsed, setElapsed] = createSignal<number>(
        fixedFrame !== null
        ? fixedFrame * _frame_duration_ms
        : 0
    );

    console.log("Elapsed initialized to: ", getElapsed())

    const getCurrentFrame = () => Math.floor(getElapsed() / (1000.0 / props.fps));

    const getCurrentScene = createMemo(() => {
        const elapsed = getElapsed();
        const count = getSceneCount();
        let sceneStart = 0, sceneEnd = 0;
        for(let i = 0; i < scenes.length; i++){
            const scene = scenes[i];
            sceneEnd = sceneStart + scene.duration;
            if(elapsed >= sceneStart && elapsed < sceneEnd){
                return (i + 1);
            }
            sceneStart = sceneEnd;
        }

        if(elapsed > sceneEnd){
            //return last scene
            return scenes.length;
        }

        return -1;
    });
    
    let done = false;
    let start : number;
    let prevTimestamp : number | null = null;

    const render = (curFrame: number) => {
        //console.log("Renderizando!", curFrame)
    }

    const tick = (timestamp: number) => {
        if(start === undefined){
            start = timestamp;
        }
        const elapsed = timestamp - start;
        setElapsed(timestamp - start);

        const _curFrame = Math.floor(elapsed / _frame_duration_ms);
        if(_curFrame !== _currentFrame){
            //render(_curFrame);
            _currentFrame = _curFrame;
        }

        if (prevTimestamp !== timestamp) {
            // Math.min() is used here to make sure the element stops at exactly 200px
            const count = Math.min(0.1 * elapsed, 200);

          }

        if(elapsed >= _total_duration){
            done = true;
        }

        if(!done){
            window.requestAnimationFrame(tick);
        }
    }

    const service = {
        getElapsed,
        getCurrentFrame,
        done: () => {
            done = true;
        },
        registerScene(scene) {
            const start = scenes.reduce((prev, cur) => prev + cur.duration, 0);
            scenes.push(scene);
            setSceneCount(scenes.length);
            _total_duration += scene.duration;
            if(scenes.length === 1 && fixedFrame === null){
                window.requestAnimationFrame(tick);
            }

            return {
                id: scenes.length,
                start,
                end: start + scene.duration,
                duration: scene.duration,
            } as SceneInfo
        },
        getCurrentScene,
    } as CompositionContextType;

    const inlineStyle = () => ({
        width: `${props.viewport.width}px`,
        height: `${props.viewport.height}px`,
    } as JSX.CSSProperties);

    createEffect(() => {
        console.log("Current scene: ", getCurrentScene())
    });

    createEffect(on(getSceneCount, () => {
        const totalDuration = scenes.map(scene => scene.duration).reduce((prev, cur) => prev + cur, 0);
        globalThis.COMPOSITION = {
            fps: props.fps,
            viewport: props.viewport,
            scenes: getSceneCount(),
            totalDuration,
            totalFrames: Math.ceil((totalDuration / 1000.0) * props.fps)
        }
    }))

    // onMount(() => {
    //     window.requestAnimationFrame(step);
    // });

    return <CompositionContext.Provider value={service}>
        <div id="composition" class="bg-white" style={inlineStyle()}>
            {props.children}

        </div>
    </CompositionContext.Provider>
}

export function useComposition() {
    return useContext(CompositionContext);
}