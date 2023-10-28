export const TYPE = {
    HTML: "htmlelem",
    COMMAND: "command-line",
    RESPONSE: "response",
    ERROR: "error-response",
};

export const EMPTY_COMMAND_LINE = {
    type: TYPE.HTML,
    value: "&nbsp;",
};

export const CONNECTING_COMMAND_LINE = {
    type: TYPE.HTML,
    value: "<b>Connecting...</b>",
};

export const PING_COMMAND_LINE = {
    type: TYPE.HTML,
    value: "Running ping to test connection...",
};

export const CONNECTED_COMMAND_LINE = {
    type: TYPE.HTML,
    value: "<b>Connected.</b>",
};

export const READY_COMMAND_LINE = {
    type: TYPE.HTML,
    value: "<b>Ready to executed commands.</b>",
};

export const ERROR_COMMAND_LINE = {
    type: TYPE.HTML,
    value: "An error occured. Can't use CLI right now. Disabling input.",
}
