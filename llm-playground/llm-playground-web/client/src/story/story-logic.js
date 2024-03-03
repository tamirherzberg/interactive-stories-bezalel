import {useCallback, useEffect, useRef} from 'react';
import {useAppState, useSetAppState} from '../app-state/AppStateProvider';
import Timer from '../utils/timer';

export function useHandleStoryResponse() {
    const nextStrangerPromptPrefix = "Set 'goalProgress' to 0. Set the next 'storyTextImportance' to 1. Use 'storyText' to introduce the player to the next person in line. You are now acting as the next person in line: "
    const secondStrangerPrompt = "Bracha, an elder lady, dressed very elegantly. She is sarcastic, witty and cares a lot about her time.\n Condition: She will only let the player pass if they say or do something embarrassing or awkward or makes them look stupid, or insult her somehow.";
    const thirdStrangerPrompt = "Vika, a 17 year old Goth-kid She listens to heavy metal, hates everything mainstream and smokes cigarette. She wears heavy makeup, dresses in black clothes and has tattos.\n Condition: She will only let the player pass if they get to know her, talk to her about one of her interests, say a deep philosophical remark or compliment her.";

    const {curStrangerIdx, endingLine} = useAppState();
    const setAppState = useSetAppState();
    const idleTimer = useRef();
    let strangerIdx = curStrangerIdx;

    function handleStoryResponse(messages, response) {
        console.log(response)
        if (!response) return;

        const newMessages = [...messages];

        if (strangerIdx === 1 && response.endingLine !== "") {
            setAppState({endingLine: response.endingLine});
        }

        function gameWon() {
            newMessages.push({
                role: 'assistant',
                content: "You made it! You charge your phone, navigate to the office and run as fast as you can." +
                    "\nTaking a deep breath, you knock on your new boss's office door."
            });
            setAppState({messages: [...newMessages]});

            idleTimer.current = new Timer(2000, () => {
                console.log("times up!")
                newMessages.push({
                    role: 'assistant', content: "\n'Come in!' a familiar voice called from the room." +
                        "\nYou open the door, and your heart drops." +
                        "\n'It was Bracha, grinning from behind the desk."
                });
                newMessages.push({
                    role: 'assistant', content: endingLine
                });
                setAppState({messages: [...newMessages]});
            });
            idleTimer.current.start();
            setAppState({messages: [...newMessages]});
        }

        if (response.storyText && response.storyTextImportance > 0.65) {
            newMessages.push({role: 'assistant', content: response.storyText});
        }
        if (response.strangerResponse) {
            newMessages.push({role: 'assistant', content: response.strangerResponse});
        }

        if (response.goalProgress === 1 || response.goalProgress === '1') {
            strangerIdx++;
            switch (strangerIdx) {
                case 0:
                    break;
                case 1:
                    newMessages.push({role: 'assistant', content: "Rona let you pass her in line! There are now only two people left to cut in line!"});
                    newMessages.push({role: 'system', content: nextStrangerPromptPrefix+secondStrangerPrompt});
                    break;
                case 2:
                    newMessages.push({role: 'assistant', content: "Bracha let you pass her in line! There's only one person left before you can charge our phone!"});
                    newMessages.push({role: 'system', content: nextStrangerPromptPrefix+thirdStrangerPrompt});
                    break;
                case 3: {
                    newMessages.push({role: 'assistant', content: "Vika let you pass her in line!"});
                    gameWon();
                    return;
                }
            }
        }

        setAppState({messages: [...newMessages], curStrangerIdx: strangerIdx});
    }

    return handleStoryResponse;
}
