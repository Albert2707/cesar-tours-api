import { v4 as uuidv4 } from 'uuid';

export const generateCustomOrderNum = () => {
    const seed = Date.now();  
    const customOrderNum = `${seed}${uuidv4().replace(/-/g, "")}`.substring(0, 12);
    return customOrderNum;
};