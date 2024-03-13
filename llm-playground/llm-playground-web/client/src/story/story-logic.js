import {useRef} from 'react';
import {useAppState, useSetAppState} from '../app-state/AppStateProvider';
import Timer from '../utils/timer';

export function useHandleStoryResponse() {
    const nextStrangerPromptPrefix = "Set 'goalProgress' to 0. Set the next 'storyTextImportance' to 1. Set 'didAskToAdvance' to false. Use 'storyText' to introduce the player to the next person in line. Never respond with a specific 'strangerResponse' more than once. You are now acting as the next person in line: "
    const secondStrangerPrompt = "Bracha, an elder lady, dressed very elegantly. She is sarcastic, witty and cares a lot about her time.\n Condition: She will only let the player pass if they ask to cut her in line and compliment her or say something funny.";
    const thirdStrangerPrompt = "Vika, a 17 year old Goth-kid She listens to heavy metal, hates everything mainstream and smokes cigarette. She wears heavy makeup, dresses in black clothes and has tattos.\n Condition: She will only let the player pass if they ask to cut them in line and show they're not mainstream or engage in deep philosophical conversation about life.";

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

        if (response.storyText && response.storyTextImportance > 0.75) {
            newMessages.push({role: 'assistant', content: response.storyText});
        }
        if (response.strangerResponse) {
            newMessages.push({role: 'assistant', content: response.strangerResponse});
        }
        if (response.innerCritic && response.innerCriticImportance > 0.6) {
            newMessages.push({role: 'assistant', content: response.innerCritic});
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
