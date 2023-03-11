import './chat.css';
import { useState } from 'react';
import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';

function Chat() {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const baseUrl = 'http://localhost:3001';

    useEffect(() => {
        connect();
    }, []);

    async function connect() {
        // open a persistent connection to HTTP server which send events in text/event-stream format
        const url = baseUrl + '/connect';
        const eventSource = new EventSource(url);

        // each received event causes to run onmessage event handler
        eventSource.onmessage = function (event) {
            const data = JSON.parse(event.data);
            const message = data.message;

            setMessages((messages) => [message, ...messages]);
        };
    }

    function inputOnChange(event) {
        setInputValue(event.target.value);
    }

    async function sendButtonOnClick() {
        const config = {
            method: 'POST',
            url: baseUrl + '/messages',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                message: {
                    id: Date.now(),
                    text: inputValue,
                },
            },
        };

        await axios(config);
    }

    function formOnSubmit(event) {
        event.preventDefault();
    }

    return (
        <div className="Chat">
            <form className="Chat__form" onSubmit={formOnSubmit}>
                <input className="Chat__form__input" type="text" value={inputValue} onChange={inputOnChange} />
                <button className="Chat__form__send-button" onClick={sendButtonOnClick}>
                    Send
                </button>
            </form>
            <div className="Chat__messages">
                {messages.map((message) => (
                    <div className="Chat__message" key={message.id}>
                        <span>{message.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Chat;
