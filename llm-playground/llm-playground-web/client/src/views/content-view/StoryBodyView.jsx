import { useEffect, useRef } from "react";
import { useAppState } from "../../app-state/AppStateProvider"
import scrollToBottom from "../../utils/scrollToBottom";
import './story-body-styles.css'
import LoadingDots from "../../components/LoadingDots";

export default function StoryBodyView() {
    const { messages, status, storyIdx, endOfIntro} = useAppState();
    const mainBodyContRef = useRef();

    useEffect(() => {
        if (mainBodyContRef.current && messages.length > 2) {
            scrollToBottom(mainBodyContRef.current);
        }
    }, [messages])

    return (
        <main ref={mainBodyContRef} id="main-body-cont">
            <div id="text-column-cont">
                <p className={"message-assistant-storyText"} style={{display:(storyIdx >= 1) ? 'inherit' : 'none', color:'black'}}>You open your eyes, and the world around you gradually sharpens into focus.</p>
                <p className={"message-assistant-storyText"} style={{display:(storyIdx >= 2) ? 'inherit' : 'none', color:'black'}}>You slowly realize you're stuck in an endless line for the women's restroom at Dizengoff Center mall.</p>
                <p className={"message-assistant-storyText"} style={{display:(storyIdx >= 3) ? 'inherit' : 'none', color:'black'}}>Why did you come here in the first place? And why are you sweating so much?</p>
                <p className={"message-assistant-storyText"} style={{display:(storyIdx >= 4) ? 'inherit' : 'none', color:'black'}}>You just need a moment to yourself to figure out what's going on.</p>
                <p className={"message-assistant-storyText"} style={{display:(storyIdx >= 5) ? 'inherit' : 'none', color:'black'}}>You must get in now.</p>
                <p className={"message-assistant-storyText"} style={{display:(storyIdx >= 6) ? 'inherit' : 'none', color:'black'}}>But the line is moving too slow.</p>
                {messages.map((msg, i) => {
                    if (msg.role === 'system') return null;
                    let messageClassName = `message-${msg.role}`;
                    if (msg.role === 'assistant') {
                        if (msg.content.startsWith("Rona:")) {
                            messageClassName += "-rona";
                        }
                        else if (msg.content.startsWith("Vika:")) {
                            messageClassName += "-vika";
                        }
                        else if (msg.content.startsWith("Bracha:")) {
                            messageClassName += "-bracha";
                        }
                        else {
                            messageClassName += "-storyText";
                        }
                    }
                    return (<p
                            key={'msg' + i}
                            className={messageClassName}
                            style={{display:(storyIdx < endOfIntro) ? 'none' : 'inherit'}}
                            dangerouslySetInnerHTML={{ __html: (msg.role === 'user' ? 'You: ' : '') + msg.content }}
                        />
                    )
                })}
                {
                    status === 'loading' && <LoadingDots />
                }
            </div>
        </main>)
}