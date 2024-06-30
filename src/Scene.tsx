import { Show, type ParentProps } from "solid-js";
import { useComposition } from "./Composition";

import "./Scene.scss";

export type SceneProps = ParentProps<{
    name: string;
    /**
     * Duration in milliseconds
     */
    duration: number;

}>

export default function Scene(props: SceneProps){
    const composition = useComposition();
    const id = composition?.registerScene(props);

    return (
        <Show when={composition?.getCurrentScene() === id}>
            <div class="scene">{props.children}</div>
        </Show>
    );
}
