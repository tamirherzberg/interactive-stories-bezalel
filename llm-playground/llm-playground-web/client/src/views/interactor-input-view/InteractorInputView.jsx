import { useCallback, useRef, useState } from "react";
import { useAppState, useSetAppState } from "../../app-state/AppStateProvider";
import "./interactor-input-styles.css";
import { SETTINGS } from "../../../settings";
import { useHandleStoryResponse } from "../../story/story-logic";

export default function InteractorInputView() {

    const { messages, status, inputMessage} = useAppState();
    let {curStrangerIdx, storyIdx, endOfIntro} = useAppState();
    const setAppState = useSetAppState();


    const handleResponse = useHandleStoryResponse();

    const continueStory = useCallback(() => {
        storyIdx++;
        setAppState({storyIdx:storyIdx})
    });

    const send = useCallback(() => {

        const newMessages = [...messages, { role: 'user', content: inputMessage }];

        setAppState({ messages: newMessages, status: 'loading', inputMessage: '' });

        fetch(
            `${SETTINGS.SERVER_URL}/story-completions`,
            {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(newMessages)
            }
        ).then(response => response.json()
        ).then(data => {
            try {
                let storytellerResponse = data.choices[0].message.content;
                storytellerResponse = JSON.parse(storytellerResponse);

                setAppState({ status: 'idle' });
                handleResponse(newMessages, storytellerResponse);

            } catch { err => { throw err } }
        }).catch(err => {
            console.error('Api error. Details: ', err);
            setAppState({ status: 'error' });
        })

    }, [messages, inputMessage]);

    let startOfEnding = endOfIntro + 1;

    function DidPassAllStrangers() {
        return curStrangerIdx >= 2;
    }

    function GetActionButtonText() {
        switch (storyIdx) {
            case endOfIntro + 1:
                return "Get into the restrooms"
            case endOfIntro + 4:
                return "Smile"
            case endOfIntro + 5:
                return "Sigh"
            case endOfIntro + 6:
                return "But I worked so hard to get there..."
            case endOfIntro + 7:
                return "Leave the restrooms"
            case endOfIntro + 8:
                return "Take a deep breath"
            default:
                return "Breath"
        }
    }

    return (
        <div
            id="interactor-box"
            style={{
                opacity: status === 'loading' ? 0.3 : 1,
                pointerEvents: status === 'loading' ? 'none' : 'auto',
                color: status === 'error' ? 'red' : 'auto',
                fontFamily: 'Arial',
                display: 'flex',
                justifyContent: 'center', // Center the content horizontally
                flexDirection: DidPassAllStrangers() ? 'column' : 'unset',
                alignItems: 'center',
            }}
        >
            <div><button onClick={continueStory} style={{display: ((storyIdx < endOfIntro || storyIdx >= startOfEnding) && storyIdx < endOfIntro + 9) ? 'inherit' : 'none', margin:'auto', fontFamily:'Helvetica'}}>{GetActionButtonText()}</button></div>
            <div style={{display: (storyIdx < endOfIntro || DidPassAllStrangers()) ? 'none': 'inherit', fontSize: 23, fontFamily:'Helvetica'}}>What do you &nbsp;<strong>want</strong>&nbsp; to say?&ensp;</div><input
                id="interactor-text-input"
                value={inputMessage}
                onKeyDown={e => { if (e.key === 'Enter') send() }}
                onChange={e => setAppState({ inputMessage: e.target.value })}
                style={{display: (storyIdx < endOfIntro || DidPassAllStrangers()) ? 'none': 'inherit'}}
            />
            <button onClick={send} style={{display: 'none'}}>Send</button>
            {
                status === 'error' && 'Something is broken 😵‍💫'
            }
        </div>
    )
}