import {useRef} from 'react';
import {useAppState, useSetAppState} from '../app-state/AppStateProvider';
import Timer from '../utils/timer';

export function useHandleStoryResponse() {
    const nextStrangerPromptPrefix = "Set 'goalProgress' to 0. Set the next 'storyTextImportance' to 1. Set 'didAskToAdvance' to false. Use 'storyText' to introduce the player to the next person in line. Never respond with a specific 'strangerResponse' more than once. You are now acting as the next person in line: "
    const secondStrangerPrompt = "Vika, a 17 year old Goth-kid She listens to heavy metal, hates everything mainstream and smokes cigarette. She wears heavy makeup, dresses in black clothes and has tattoos.\n Condition: She will only let the player pass if they ask to cut them in line and show they're not mainstream, engage in deep philosophical conversation about life or compliment her.";

    const {curStrangerIdx, endingLine, storyIdx, messages} = useAppState();
    const setAppState = useSetAppState();
    const idleTimer = useRef();
    let strangerIdx = curStrangerIdx;

    function handleStoryResponse(messages, response) {
        console.log(response)

        if (!response) return;

        messages.pop();
        setAppState({messages: messages});

        const newMessages = [...messages];

        newMessages.push({role: 'user', content: "You: " + response.socialAnxietyModifiedInput});

        if (strangerIdx === 1 && response.endingLine !== "") {
            setAppState({endingLine: response.endingLine});
        }

        function gameWon() {
            setAppState({storyIdx:storyIdx+1});
        }

        if (response.strangerResponse) {
            newMessages.push({role: 'assistant', content: response.strangerResponse});
        }
        if (response.innerCritic && response.innerCriticImportance > 0.7) {
            newMessages.push({role: 'assistant', content: response.innerCritic});
        }

        if (response.goalProgress === 1 || response.goalProgress === '1') {
            strangerIdx++;
            switch (strangerIdx) {
                case 0:
                    break;
                case 1:
                    newMessages.push({role: 'assistant', content: "Can't believe she let me pass her. Maybe she felt sorry for me?"});
                    newMessages.push({role: 'assistant', content: "Only one person left! She looks like a 'center-kid' - dark clothes, heavy makeup... She would never let me go before her."});
                    newMessages.push({role: 'system', content: nextStrangerPromptPrefix+secondStrangerPrompt});
                    break;
                case 2:
                    newMessages.push({role: 'assistant', content: "Can't believe it - she let me pass her in line too!"});
                    gameWon();
                    return;
            }
        }

        setAppState({messages: [...newMessages], curStrangerIdx: strangerIdx});
    }

    return handleStoryResponse;
}
