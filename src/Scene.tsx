import { Show, createContext, useContext, type ParentProps } from "solid-js";
import { type SceneInfo, useComposition } from "./Composition";

import "./Scene.scss";
import { Viewport } from "./types";

type SceneContextType = {
    start: number
    end: number
    duration: number
}

const SceneContext = createContext<SceneInfo>();

export type SceneProps = ParentProps<{
    name: string;
    /**
     * Duration in milliseconds
     */
    duration: number;

}>

export default function Scene(props: SceneProps){
    const composition = useComposition();
    const info = composition?.registerScene(props);

    console.log(`Scene "${props.name}" registered. Info: `, info)

    return (
        <SceneContext.Provider value={info}>
            <Show when={composition?.getCurrentScene() === info?.id}>
                <div class="scene">{props.children}</div>
            </Show>
        </SceneContext.Provider>
    );
}

export function useParentScene() {
    return useContext(SceneContext);
}