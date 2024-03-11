import {useRef} from 'react';
import {useAppState, useSetAppState} from '../app-state/AppStateProvider';
import Timer from '../utils/timer';

export function useHandleStoryResponse() {
    const nextStrangerPromptPrefix = "Set 'goalProgress' to 0. Set the next 'storyTextImportance' to 1. Set 'didAskToAdvance' to false. Use 'storyText' to introduce the player to the next person in line. Never respond with a specific 'strangerResponse' more than once. You are now acting as the next person in line: "
    const secondStrangerPrompt = "Bracha, an elder lady, dressed very elegantly. She is sarcastic, witty and cares a lot about her time.\n Condition: She will only let the player pass if they ask to cut her in line and say or do something offensive, threatening, insulting, embarrassing, awkward or something that makes Sarah look stupid.";
    const thirdStrangerPrompt = "Vika, a 17 year old Goth-kid She listens to heavy metal, hates everything mainstream and smokes cigarette. She wears heavy makeup, dresses in black clothes and has tattos.\n Condition: She will only let the player pass if they ask to cut them in line and get to know her, talk to her about one of her interests, say a deep philosophical remark or compliment her.";

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
            setAppState({messages: [...newMessages], curStrangerIdx:strangerIdx});

            idleTimer.current = new Timer(5000, () => {
                strangerIdx++;
                newMessages.push({
                    role: 'assistant', content: "\n'Come in!' a familiar voice called from the room." +
                        "\nYou open the door, and your heart drops." +
                        "\nIt was Bracha, grinning from behind the desk."
                });
                newMessages.push({
                    role: 'assistant', content: endingLine
                });
                setAppState({messages: [...newMessages], curStrangerIdx:strangerIdx});
            });
            idleTimer.current.start();
            setAppState({messages: [...newMessages], curStrangerIdx:strangerIdx});
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
