import { useEffect, useRef } from "react";
import { useAppState } from "../../app-state/AppStateProvider"
import scrollToBottom from "../../utils/scrollToBottom";
import './story-body-styles.css'
import LoadingDots from "../../components/LoadingDots";

export default function StoryBodyView() {
    const { messages, status, storyIdx, endOfIntro, endingLine} = useAppState();
    const mainBodyContRef = useRef();

    useEffect(() => {
        if (mainBodyContRef.current && messages.length > 2) {
            scrollToBottom(mainBodyContRef.current);
        }
    }, [messages])

    return (
        <main ref={mainBodyContRef} id="main-body-cont">
            <div id="text-column-cont">
                <p className={"message-assistant-storyText"} style={{display:(storyIdx >= 1) ? 'inherit' : 'none', color:'black'}}>You open your eyes, and the world around you comes into focus.</p>
                <p className={"message-assistant-storyText"} style={{display:(storyIdx >= 2) ? 'inherit' : 'none', color:'black'}}>Uh-oh, you're stuck in an endless line for the women's restrooms at Dizengoff Center mall.</p>
                <p className={"message-assistant-storyText"} style={{display:(storyIdx >= 3) ? 'inherit' : 'none', color:'black'}}>Why are you sweating so much?</p>
                <p className={"message-assistant-storyText"} style={{display:(storyIdx >= 4) ? 'inherit' : 'none', color:'black'}}>Oh, right. Another anxiety attack.</p>
                <p className={"message-assistant-storyText"} style={{display:(storyIdx >= 5) ? 'inherit' : 'none', color:'black'}}>Then it hits you - it's the first day at your new job and you got lost on the way there.</p>
                <p className={"message-assistant-storyText"} style={{display:(storyIdx >= 6) ? 'inherit' : 'none', color:'black'}}>All you need is a moment of privacy. And to wash your face.</p>
                <p className={"message-assistant-storyText"} style={{display:(storyIdx >= 7) ? 'inherit' : 'none', color:'black'}}>The line moves too slowly - you're gonna be very late! You must get in now!</p>
                {messages.map((msg, i) => {
                    if (msg.role === 'system') return null;
                    let messageClassName = `message-${msg.role}`;
                    if (msg.role === 'user' && !msg.content.startsWith("You: ")) {
                        return null;
                    }
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
                            dangerouslySetInnerHTML={{ __html: msg.content }}
                        />
                    )
                })}
                {/* TODO: ADD POSITIVE INNER VOICE*/}
                <p className={"message-assistant-storyText"} style={{display:(storyIdx >= endOfIntro + 1) ? 'inherit' : 'none', color:'black'}}>You made it! You charge your phone, navigate to the office and run as fast as you can. Taking a deep breath, you knock on your new boss's office door.</p>
                <p className={"message-assistant-storyText"} style={{display:(storyIdx >= endOfIntro + 2) ? 'inherit' : 'none', color:'black'}}>'Come in!' a familiar voice called from the room.</p>
                {/* TODO: CHANGE BREATH TO KNOCK*/}
                <p className={"message-assistant-storyText"} style={{display:(storyIdx >= endOfIntro + 3) ? 'inherit' : 'none', color:'black'}}>You can't believe your eyes. It's Bracha, grinning from behind the desk.</p>
                <p className={"message-assistant-storyText"} style={{display:(storyIdx >= endOfIntro + 3) ? 'inherit' : 'none', color:'black'}}>Bracha: {endingLine}</p> {/* todo: use her style?*/}
                {
                    status === 'loading' && <LoadingDots />
                }
            </div>
        </main>)
}