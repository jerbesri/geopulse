import { type ListenMessage, ListenMessageType, type PostMessage } from './post-message-types';
export declare function postMessage(message: PostMessage): void;
/**
 * Start listening to messages of the given type and call the specified callback
 *
 * @param type the type of messages to listen to
 * @param callback the function to execute whenever one of those messages is received
 * @return It returns a handle, which can be used to cancel listening for post messages using the `handle.remove()` method.
 */
export declare function listenToPostMessage(type: ListenMessageType, callback: (message: ListenMessage) => void): __esri.Handle;
