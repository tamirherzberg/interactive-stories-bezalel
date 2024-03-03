import { useEffect, useRef } from "react";
import { useAppState } from "../../app-state/AppStateProvider"
import scrollToBottom from "../../utils/scrollToBottom";
import './story-body-styles.css'
import LoadingDots from "../../components/LoadingDots";

export default function StoryBodyView() {
    const { messages, status } = useAppState();

    const mainBodyContRef = useRef();

    useEffect(() => {
        if (mainBodyContRef.current && messages.length > 2) {
            scrollToBottom(mainBodyContRef.current);
        }
    }, [messages])

    return (
        <main ref={mainBodyContRef} id="main-body-cont">
            <div id="text-column-cont">
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
                    >
                        {(msg.role=== 'user'? 'Tsila: ':'')+ msg.content}
                    </p>
                    )
                })}
                {
                    status === 'loading' && <LoadingDots />
                }
            </div>
        </main>)
}