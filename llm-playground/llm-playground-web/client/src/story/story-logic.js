import { useCallback, useEffect, useRef } from 'react';
import { useAppState, useSetAppState } from '../app-state/AppStateProvider';
import Timer from '../utils/timer';

export function useHandleStoryResponse() {
    const secondStrangerPrompt = "Set goalProgress to 0. You are now acting as the next person in line: Bracha, an elder lady, dressed very elegantly. She is sarcastic, witty and cares a lot about her time.\n Condition: She will only let the player pass if they say or do something that make them look stupid or embarrassing.";
    const thirdStrangerPrompt = "Set goalProgress to 0. You are now acting as the next person in line: Vika, a 17 year old goth teen. She appreciates of the darker side of life, mysterious beauty, dark aesthetics and art. She listens to heavy metal, dresses in black clothes and has multiple piercings and tattoos.\n Condition: She will only let the player pass if they talk to her about one of her interests, say a deep philosophical remark or compliment her.";

    const { inputMessage } = useAppState();
    const setAppState = useSetAppState();
    const idleTimer = useRef();
    const {curStrangerIdx} = useAppState();
    let strangerIdx = curStrangerIdx;

    useEffect(() => {
        idleTimer.current?.cancel();
    }, [inputMessage]);

    function handleStoryResponse(messages, response) {
        console.log(response)
        if (!response) return;

        const newMessages = [...messages];

        // Test modifying the words limit:
        // if (!isNaN(parseInt(newMessage))) {
        //     newMessages.push({ role: 'system', content: `Your next storyText output has maximum length of ${newMessage} words.` })
        // }

        function gameWon() {
            newMessages.push({ role: 'assistant', content: "Tsila made it! She charges her phone, navigates to the office and runs as fast as she can." +
                    "\nTaking a deep breath, she knocks on her new boss's office door." +
                    "\n'Come in!' a familiar voice called from the room." +
                    "\nTsila opens the door, and her heart drops." +
                    "\n'It was Bracha, grinning from behind the desk."});
            setAppState({ messages: [...newMessages] });
        }

        if (response.goalProgress === 1) {
            strangerIdx++;
            switch (strangerIdx) {
                case 0:
                    break;
                case 1:
                    newMessages.push({ role: 'assistant', content: "Rona let you pass her in line!" });
                    newMessages.push({ role: 'system', content: secondStrangerPrompt });
                    break;
                case 2:
                    newMessages.push({ role: 'assistant', content: "Bracha let you pass her in line!" });
                    newMessages.push({ role: 'system', content: thirdStrangerPrompt });
                    break;
                case 3: {
                    newMessages.push({ role: 'assistant', content: "Vika let you pass her in line!" });
                    gameWon();
                    return;
                }
            }
        }
        if (response.storyText) {
            newMessages.push({ role: 'assistant', content: response.storyText });
        }
        if (response.strangerResponse) {
            newMessages.push({ role: 'assistant', content: response.strangerResponse});
        }

        setAppState({ messages: [...newMessages], curStrangerIdx: strangerIdx});
        // TODO: end story with a long closing paragraph, and 'THE END' message.

        // If the player is idle for a long period, add some content or a hint to push the story forward.
        idleTimer.current = new Timer(15000, () => {
            if (response.storyEvent && Math.random() > 0.7) {
                // Trigger an independent story event:
                newMessages.push({ role: 'assistant', content: response.storyEvent });
                setAppState({ messages: [...newMessages]});
            }

            if (response.callToAction) {
                // Apply call to action hint:
                newMessages.push({ role: 'assistant', content: `(${response.callToAction})` });
                setAppState({ messages: [...newMessages] });
            }
        });
        idleTimer.current.start();
    }

    return handleStoryResponse;
}
