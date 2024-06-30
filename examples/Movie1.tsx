
import Composition from "../src/Composition";
import Scene from "../src/Scene";
import Animation from "../src/Animation";
import { easeOutQuart, easeOutBack } from "../src/animations"
import { VIEWPORTS } from "../src/viewports";

export default function Movie1(){
    return (
        <Composition fps={30} viewport={VIEWPORTS.IPHONE_11}>
            <Scene name="Escena 1" duration={4000}>
                <Animation function={easeOutBack} duration={1000}>{(value) => {
                    return <h1 style={{
                        opacity: value(),
                        "font-size": `${8 + (16*value())}px`
                    }}>Acto 1</h1>
                }}</Animation>
                
            </Scene>
            <Scene name="Escena 2" duration={2000}>
                <Animation function={easeOutBack} duration={1000}>
                    {(value) => {
                        return <p style={{
                            position: "relative",
                            top: `${(1 - value())*500}px`
                        }}>"Las pelotas"</p>
                    }}
                </Animation>
                
            </Scene>

        </Composition>
    );
}