import { teacher } from './npcs/teacher.js';
import { rat } from './npcs/rat.js';

export const NPC_REGISTRY = {
    [teacher.id]: teacher,
    [rat.id]: rat
};
