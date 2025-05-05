import React from "react"; 
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useUser } from "../context/UserContext"; 
import { useParams } from "react-router-dom";

function ChatBot() {
    const { user } = useUser();

    return (
        <div class="border border-primary rounded p-3 border-lime-500">
            <h2>ChatBot</h2>
            <div class="border border-primary rounded p-3 border-lime-300">
                <div>
                    <p class="p">{`  Witaj ${user}! Jak mogę Ci pomóc?`}</p>
                </div>
            </div>
            <input class="input" type="text" placeholder="Napisz wiadomość..." />
            <button>Wyślij</button>
        </div>
    )
}

export default ChatBot;