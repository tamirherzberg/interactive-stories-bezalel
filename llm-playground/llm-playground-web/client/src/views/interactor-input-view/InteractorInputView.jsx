import { useCallback, useEffect, useRef, useState } from "react";
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


    // console.log(curStrangerIdx);
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
                flexDirection: (curStrangerIdx >= 3) ? 'column' : 'unset',
                alignItems: 'center',
            }}
        >
            <div><button onClick={continueStory} style={{display: (storyIdx < endOfIntro) ? 'inherit' : 'none', margin:'auto'}}>Breath</button></div>
            <img src="https://c.tenor.com/07cmziHz9hQAAAAC/tenor.gif" alt="FIN" style={{justifyContent: 'center', display: curStrangerIdx == 4 ? 'inherit':'none'}}/>
            <div style={{display: (storyIdx < endOfIntro || curStrangerIdx >= 3) ? 'none': 'inherit'}}>You:&ensp;</div><input
                id="interactor-text-input"
                value={inputMessage}
                onKeyDown={e => { if (e.key === 'Enter') send() }}
                onChange={e => setAppState({ inputMessage: e.target.value })}
                style={{display: (storyIdx < endOfIntro || curStrangerIdx >= 3) ? 'none': 'inherit'}}
            />
            <button onClick={send} style={{display: (storyIdx < endOfIntro || curStrangerIdx >= 3) ? 'none': 'inherit'}}>Send</button>
            {
                status === 'error' && 'Something is broken 😵‍💫'
            }
        </div>
    )
}