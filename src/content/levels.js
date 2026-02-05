import { schoolYard } from './schoolYard.js';
import { schoolHall } from './schoolHall.js';
import { basement } from './basement.js';

export const LEVELS = {
    [schoolYard.id]: schoolYard,
    [schoolHall.id]: schoolHall,
    [basement.id]: basement
};
