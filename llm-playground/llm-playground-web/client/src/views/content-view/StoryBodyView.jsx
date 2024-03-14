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
                <p className={"message-assistant-storyText"} style={{display:(storyIdx >= 1) ? 'inherit' : 'none', color:'black'}}>You open your eyes. The world around you slowly comes into focus, like an old photo developing in a darkroom</p>
                <p className={"message-assistant-storyText"} style={{display:(storyIdx >= 2) ? 'inherit' : 'none', color:'black'}}>Uh-oh, you're stuck in the line for the women's restrooms at Dizengoff Center mall.</p>
                <p className={"message-assistant-storyText"} style={{display:(storyIdx >= 3) ? 'inherit' : 'none', color:'black'}}>Why are you sweating so much?</p>
                <p className={"message-assistant-storyText"} style={{display:(storyIdx >= 4) ? 'inherit' : 'none', color:'black'}}>Oh, right. You just had an anxiety attack.</p>
                <p className={"message-assistant-storyText"} style={{display:(storyIdx >= 5) ? 'inherit' : 'none', color:'black'}}>Then it hits you - you are late to a job interview at the top accounting firm in the world.</p>
                <p className={"message-assistant-storyText"} style={{display:(storyIdx >= 6) ? 'inherit' : 'none', color:'black'}}>All you need is a moment of privacy. And to wash your face.</p>
                <p className={"message-assistant-storyText"} style={{display:(storyIdx >= 7) ? 'inherit' : 'none', color:'black'}}>But the line moves too slowly - you're gonna be so late! You must get in now!</p>
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
                <p className={"message-assistant-storyText"} style={{display:(storyIdx >= endOfIntro + 2) ? 'inherit' : 'none', color:'black'}}>You splash water on your face, trying to calm down.</p>
                <p className={"message-assistant-storyText"} style={{display:(storyIdx >= endOfIntro + 3) ? 'inherit' : 'none', color:'black'}}>As you look into the mirror, something shifts within you.</p>
                <p className={"message-assistant-storyText"} style={{display:(storyIdx >= endOfIntro + 4) ? 'inherit' : 'none'}}>{endingLine}</p>
                <p className={"message-assistant-storyText"} style={{display:(storyIdx >= endOfIntro + 5) ? 'inherit' : 'none'}}>The only one who's judging me is myself.</p>
                <p className={"message-assistant-storyText"} style={{display:(storyIdx >= endOfIntro + 6) ? 'inherit' : 'none'}}>Suddenly, the pressure to work for a prestigious corporate to prove my worth seems so pointless.</p>
                <p className={"message-assistant-storyText"} style={{display:(storyIdx >= endOfIntro + 7) ? 'inherit' : 'none'}}>Sometimes I must insist on what's important to me and the world will adjust accordingly.</p>
                <p className={"message-assistant-storyText"} style={{display:(storyIdx >= endOfIntro + 8) ? 'inherit' : 'none', color:'black'}}>You decide to skip the interview and chase your true passion - photography.</p>
                <p className={"message-assistant-storyText"} style={{display:(storyIdx >= endOfIntro + 9) ? 'inherit' : 'none', color:'black'}}>This isn't the end – it's the first frame of a whole new picture.</p>
                {
                    status === 'loading' && <LoadingDots />
                }
            </div>
        </main>)
}