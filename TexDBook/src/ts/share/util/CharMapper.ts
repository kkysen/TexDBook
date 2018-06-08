export interface CharMapper {
    
    test(c: string): boolean;
    
    map(c: string): string;
    
}


export interface CharMappers {
    
    readonly any: CharMapper;
    
    readonly none: CharMapper;
    
    readonly allowDigits: CharMapper;
    
    readonly onlyDigits: CharMapper;
    
}

export const identity = <T>(t: T): T => t;
export const makeTrue = (...args: any[]): true => true;
export const makeFalse = (...args: any[]): false => false;
export const makeEmpty = (c: string): "" => "";

/**
 * Check if a single character string is a allowDigits.
 *
 * @param {string} char a single character string
 * @returns {boolean} if the character is a allowDigits 0-9
 */
export const isDigit = function(char: string): boolean {
    return !Number.isNaN(parseInt(char));
};

export const CharMapper: CharMappers = (() => {
    
    const any: CharMapper = {
        test: makeTrue,
        map: identity,
    };
    
    const none: CharMapper = {
        test: makeTrue,
        map: makeEmpty,
    };
    
    const allowDigits: CharMapper = {
        test: isDigit,
        map: identity,
    };
    
    const onlyDigits: CharMapper = {
        test: isDigit.negate(),
        map: makeEmpty,
    };
    
    const toUpper: CharMapper = {
        test: makeTrue,
        map: c => c.toUpperCase(),
    };
    
    const toLower: CharMapper = {
        test: makeTrue,
        map: c => c.toLowerCase(),
    };
    
    return {
        any,
        none,
        allowDigits,
        onlyDigits,
    }
        .freezeFields()
        .freeze();
})();