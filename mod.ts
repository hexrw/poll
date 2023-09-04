/**
 * Periodically calls a provided function with a specified delay until a stopping condition is met.
 *
 * @param {() => any} fn The function to execute.
 * @param {number | (() => number)} delayOrDelayCallback The delay (in milliseconds) between function calls. Can also be a function.
 * @param {() => boolean | Promise<boolean>} [shouldStopPolling] A callback function that determines when to stop polling.
 * @returns {Promise<void>}
 */
export default async function poll(
    // deno-lint-ignore no-explicit-any
    fn: any,
    delayOrDelayCallback: number | (() => number),
    shouldStopPolling: () => boolean | Promise<boolean> = () => false
): Promise<void> {
    do {
        await fn()
        if (await shouldStopPolling()) break;
        const delay = typeof delayOrDelayCallback === "number"
            ? delayOrDelayCallback
            : delayOrDelayCallback()
        await new Promise( resolve => setTimeout(resolve, Math.max(0, delay)) )
    } while (!(await shouldStopPolling()))
}
