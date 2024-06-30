import { Accessor, JSXElement } from "solid-js"
import { useComposition } from "./Composition";


type Props = {
    function: (x: number) => number;
    duration: number;
    children: (value: Accessor<number>) => JSXElement;
}


export default function Animation(props: Props){

    const { getElapsed } = useComposition()!;
    let animationStart : number | null = null;

    const val = () => {
        const elapsed = getElapsed();
        if(animationStart === null){
            animationStart = elapsed;
        }
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