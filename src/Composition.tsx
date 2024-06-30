import { SceneProps } from "./Scene"
import type { Viewport } from "./types"
import { type Accessor, createContext, createSignal, type ParentProps, useContext, JSX, onMount, createEffect, createMemo } from "solid-js"

type Props = ParentProps<{
    id?: string
    fps: number
    viewport: Viewport
}>

type CompositionContextType = {
    getElapsed: Accessor<number>
    getCurrentFrame: Accessor<number>
    registerScene: (scene: SceneProps) => void;
    getCurrentScene: () => number;
    done: () => void;
}

declare global {
    var COMPOSITION: {
        fps: number
        viewport: {
            width: number
            height: number
        }
    };
  }

const CompositionContext = createContext<CompositionContextType>();

export default function Composition(props: Props){
    globalThis.COMPOSITION = {
        fps: props.fps,
        viewport: props.viewport,
    }
    const scenes = [] as SceneProps[];
    let _total_duration = 0;
    const _fps = props.fps;
    const _fps_ms_wait = 1000.0 / props.fps;
    console.log(`Refrescando cada ${_fps_ms_wait}ms`)
    let _currentFrame = 0;
    //const [getCurrentFrame, setCurrentFrame] = createSignal(0);
    const [getDone, setDone] = createSignal<boolean>(false);
    //const [getCurrentScene, setCurrentScene] = createSignal<number>(-1);
    const [getElapsed, setElapsed] = createSignal<number>(0);

    const getCurrentFrame = () => Math.floor(getElapsed() / (1000.0 / props.fps));

    const getCurrentScene = createMemo(() => {
        const elapsed = getElapsed();
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

        const _curFrame = Math.floor(elapsed / _fps_ms_wait);
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
            scenes.push(scene);
            _total_duration += scene.duration;
            if(scenes.length === 1){
                window.requestAnimationFrame(tick);
            }
            return scenes.length;
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