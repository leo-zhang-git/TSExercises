/*

Intro:

    For some unknown reason most of our developers left
    the company. We need to actively hire now.
    In the media we've read that companies that invent
    and publish new technologies attract more potential
    candidates. We need to use this opportunity and
    invent and publish some npm packages. Following the
    new trend of functional programming in JS we
    decided to develop a functional utility library.
    This will put us on the bleading edge since we are
    pretty much sure no one else did anything similar.
    We also provided some jsdoc along with the
    functions, but it might sometimes be inaccurate.

Exercise:

    Provide proper typing for the specified functions.

Bonus:

    Could you please also refactor the code to reduce
    code duplication?
    You might need some excessive type casting to make
    it really short.

*/
function toFunctional(f:Function):Function{
    let argCnt = f.length
    function CreateSubFunction(...preArgs: unknown[]){
        return function(this: unknown){
            let curArgs = preArgs.concat(arguments)
            if(curArgs.length > argCnt) throw new Error("Too many args")
            else if (curArgs.length === argCnt) return f.apply(this, curArgs)
            return CreateSubFunction(curArgs)
        }
    }
    return CreateSubFunction()
}


/**
 * 2 arguments passed: returns a new array
 * which is a result of input being mapped using
 * the specified mapper.
 *
 * 1 argument passed: returns a function which accepts
 * an input and returns a new array which is a result
 * of input being mapped using original mapper.
 *
 * 0 arguments passed: returns itself.
 *
 * @param {Function} mapper
 * @param {Array} input
 * @return {Array | Function}
 */
interface MapperFunc<I, O> {
    (): MapperFunc<I, O>;
    (input: I[]): O[];
}
type Mapper<I, O> = (input: I) => O


interface MapFunc {
    (): MapFunc;
    <I, O>(mapper:  Mapper<I, O>): MapperFunc<I, O>;
    <I, O>(mapper:  Mapper<I, O>, input: I[]): O[];
}

export const map = toFunctional(<I, O>(mapper: Mapper<I, O>, input: I[]) => input.map(mapper)) as MapFunc



/**
 * 2 arguments passed: returns a new array
 * which is a result of input being filtered using
 * the specified filter function.
 *
 * 1 argument passed: returns a function which accepts
 * an input and returns a new array which is a result
 * of input being filtered using original filter
 * function.
 *
 * 0 arguments passed: returns itself.
 *
 * @param {Function} filterer
 * @param {Array} input
 * @return {Array | Function}
 */
type Filterer<I> = (input: I) => boolean
interface FiltererFunc<I>{
    ():FiltererFunc<I>
    (input: I[]): I[]
}

interface FilterFunc{
    (): FilterFunc;
    <I>(filterer: Filterer<I>): FiltererFunc<I>;
    <I>(filterer: Filterer<I>, input: I[]): I[];
}

export const filter = toFunctional(<I>(filterer: Filterer<I>, input: I[]) => input.filter(filterer)) as FilterFunc

/**
 * 3 arguments passed: reduces input array it using the
 * specified reducer and initial value and returns
 * the result.
 *
 * 2 arguments passed: returns a function which accepts
 * input array and reduces it using previously specified
 * reducer and initial value and returns the result.
 *
 * 1 argument passed: returns a function which:
 *   * when 2 arguments is passed to the subfunction, it
 *     reduces the input array using specified initial
 *     value and previously specified reducer and returns
 *     the result.
 *   * when 1 argument is passed to the subfunction, it
 *     returns a function which expects the input array
 *     and reduces the specified input array using
 *     previously specified reducer and inital value.
 *   * when 0 argument is passed to the subfunction, it
 *     returns itself.
 *
 * 0 arguments passed: returns itself.
 *
 * @param {Function} reducer
 * @param {*} initialValue
 * @param {Array} input
 * @return {* | Function}
 */

type Reducer<I, O> = (pre: O, cur: I) => O
interface ReduceInitialFunc<I, O>{
    ():ReduceInitialFunc<I, O>
    (input: I[]): O
}
interface ReducerFunc<I, O>{
    (): ReducerFunc<I, O>
    (pre: O): ReduceInitialFunc<I, O>
    (pre: O, input: I[]): O
}
interface ReduceFunc{
    ():ReduceFunc
    <I, O>(f: Reducer<I, O>): ReducerFunc<I, O>
    <I, O>(f: Reducer<I, O>, pre: O): ReduceInitialFunc<I, O>
    <I, O>(f: Reducer<I, O>, pre: O, input: I[]): O
}

export const reduce = toFunctional(<I, O>(reducer: Reducer<I, O>, pre: O, input: I[]) => input.reduce(reducer, pre)) as ReduceFunc

/**
 * 2 arguments passed: returns sum of a and b.
 *
 * 1 argument passed: returns a function which expects
 * b and returns sum of a and b.
 *
 * 0 arguments passed: returns itself.
 *
 * @param {Number} a
 * @param {Number} b
 * @return {Number | Function}
 */
interface AddSubFunc{
    (): AddSubFunc
    (b: number): number
}
interface AddFunc{
    ():AddFunc
    (a: number): AddSubFunc
    (a: number, b: number): number
}
export const add = toFunctional((a: number, b: number) => a + b ) as AddFunc

/**
 * 2 arguments passed: subtracts b from a and
 * returns the result.
 *
 * 1 argument passed: returns a function which expects
 * b and subtracts b from a and returns the result.
 *
 * 0 arguments passed: returns itself.
 *
 * @param {Number} a
 * @param {Number} b
 * @return {Number | Function}
 */
export const subtract = toFunctional((a: number, b: number) => a - b ) as AddFunc

/**
 * 2 arguments passed: returns value of property
 * propName of the specified object.
 *
 * 1 argument passed: returns a function which expects
 * propName and returns value of property propName
 * of the specified object.
 *
 * 0 arguments passed: returns itself.
 *
 * @param {Object} obj
 * @param {String} propName
 * @return {* | Function}
 */
interface SubPropFunc<K extends string>{
    ():SubPropFunc<K>
    <O extends {[key in K]: O[K]}>(obj: O): O[K];
}
interface PropFunc{
    (): PropFunc
    <K extends string>(propName: K): SubPropFunc<K>
    <T, K extends keyof T>(propName: K, obj: T): T[K]
}
export const prop = toFunctional(<T, K extends keyof T>(propName: K, obj: T) => obj[propName]) as PropFunc

/**
 * >0 arguments passed: expects each argument to be
 * a function. Returns a function which accepts the
 * same arguments as the first function. Passes these
 * arguments to the first function, the result of
 * the first function passes to the second function,
 * the result of the second function to the third
 * function... and so on. Returns the result of the
 * last function execution.
 *
 * 0 arguments passed: returns itself.
 *
 * TODO TypeScript
 *   * Should properly handle at least 5 arguments.
 *   * Should also make sure argument of the next
 *     function matches the return type of the previous
 *     function.
 *
 * @param {Function[]} functions
 * @return {*}
 */
type PipeArgFunc<I, O> = (args: I) => O
interface PipeFunc{
    (): PipeFunc
    <I, O>(f1: PipeArgFunc<I, O>): PipeArgFunc<I, O>
    <I, O1, O2>(f1: PipeArgFunc<I, O1>, f2: PipeArgFunc<O1, O2>): PipeArgFunc<I, O2>
    <I, O1, O2, O3>(f1: PipeArgFunc<I, O1>, f2: PipeArgFunc<O1, O2>, f3: PipeArgFunc<O2, O3>): PipeArgFunc<I, O3>
    <I, O1, O2, O3, O4>(f1: PipeArgFunc<I, O1>, f2: PipeArgFunc<O1, O2>, f3: PipeArgFunc<O2, O3>, f4: PipeArgFunc<O3, O4>): PipeArgFunc<I, O4>
}
export const pipe = function(...functions: Function[]){
    if (arguments.length === 0) {
        return pipe;
    }
    return function subFunction() {
        let nextArguments = Array.from(arguments);
        let result;
        for (const func of functions) {
            result = func(...nextArguments);
            nextArguments = [result];
        }
        return result;
    };
} as PipeFunc
