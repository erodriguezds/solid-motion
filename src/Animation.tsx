import { Accessor, JSXElement } from "solid-js"
import { useComposition } from "./Composition";
import { useParentScene } from "./Scene";


type Props = {
    function: (x: number) => number;
    duration: number;
    children: (value: Accessor<number>) => JSXElement;
}


export default function Animation(props: Props){
    const sceneInfo = useParentScene();

    if(!sceneInfo){
        console.warn("Animations must be used inside a Scene");
        return <>{props.children(() => 1)}</>
    }

    const { getElapsed } = useComposition()!;
    let animationStart = sceneInfo.start;

    const val = () => {
        const elapsed = getElapsed();
        const animationEnd = animationStart + props.duration;
        const animationElapsed = (
            elapsed > animationEnd
            ? animationEnd
            : elapsed
        ) - animationStart;

        const x = (animationElapsed / props.duration);

        return props.function(x);
    }

    return <>{props.children(val)}</>


}