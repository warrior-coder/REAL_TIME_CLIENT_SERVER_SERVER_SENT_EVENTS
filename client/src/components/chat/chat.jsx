import './chat.css';
import { useState } from 'react';
import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';

function Chat() {
    const [messages, setMessages] = useState([]);
    const [messageInputValue, setMessageInputValue] = useState('');
    const baseUrl = 'http://localhost:3001';

    useEffect(() => {
        connectToServerEvents();
    }, []);

    async function connectToServerEvents() {
        const url = baseUrl + '/connect';

        // open a persistent connection to HTTP server to begin receiving events from it
        const eventSource = new EventSource(url);

        // each sent event causes to run onmessage event handler
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const message = data.message;

            setMessages((messages) => [message, ...messages]);
        };
    }

    function messageInput_onChange(event) {
        setMessageInputValue(event.target.value);
    }

    async function sendButton_onClick() {
        const config = {
            method: 'POST',
            url: baseUrl + '/messages',
            headers: {
                'Content-Type': 'Application/JSON',
            },
            data: {
                message: {
                    id: Date.now(),
                    text: messageInputValue,
                },
            },
        };

        await axios(config);

        setMessageInputValue('');
    }

    function messageForm_onSubmit(event) {
        // prevent default form behavior on submitting
        event.preventDefault();
    }

    return (
        <div className="Chat">
            <form className="Chat__message-form" onSubmit={messageForm_onSubmit}>
                <input
                    className="Chat__message-input"
                    type="text"
                    value={messageInputValue}
                    onChange={messageInput_onChange}
                />
                <button className="Chat__send-button" onClick={sendButton_onClick}>
                    Send
                </button>
            </form>
            <div className="Chat__messages">
                {messages.map((message) => {
                    return (
                        <div className="Chat__message" key={message.id}>
                            <span>{message.text}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Chat;
